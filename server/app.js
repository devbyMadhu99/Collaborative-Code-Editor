require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const { GoogleGenAI } = require("@google/genai");
const RoomCode = require("./models/RoomCode");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Code = require("./models/Code");
const User = require("./models/User");
const authMiddleware = require("./middleware/auth");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;

// MIDDLEWARE
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

// SOCKET.IO SETUP
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Store latest code separately for each room
const roomCodes = new Map();

// HOME
app.get("/", (req, res) => {
    res.send("Collaborative Code Editor Server is running");
});

 // AI ASSISTANT
app.post("/ai-assistant", async (req, res) => {
    try {
        const { code, language, action } = req.body || {};

        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({
                message: "Please provide code"
            });
        }

        if (code.length > 20000) {
            return res.status(400).json({
                message: "Code is too long. Please send less than 20000 characters."
            });
        }

        if (!["explain", "fix"].includes(action)) {
            return res.status(400).json({
                message: "Action must be explain or fix"
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: "Gemini API key is missing from server/.env"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const selectedLanguage =
            typeof language === "string" ? language : "javascript";

        const prompt = action === "explain"
    ? `Explain this ${selectedLanguage} code in simple English.
Keep it short: maximum 80 words.
Use simple sentences and short paragraphs.
Do not use headings, Markdown, #, *, bold text, or bullet points.
If there is an error, mention it briefly and show the correct line.

Code:
${code}`
    : `Review this ${selectedLanguage} code for errors.
Return the complete corrected code inside exactly one code block.
After it, explain the main fix in one short sentence.
Do not use headings, bullet points, bold text, or #.
If no issue is found, say so briefly.
Do not claim that you executed the code.

Code:
${code}`;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        res.json({
            answer: response.text || "AI returned no text."
        });
    }catch (error) {
        console.error("AI assistant error:", error.message);

        res.status(502).json({
            message: error.message || "AI request failed"
        });
    }
});

// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// SAVE CODE
app.post("/save-code", authMiddleware, async (req, res) => {
    try {
        const { code, language } = req.body;

        if (typeof code !== "string") {
            return res.status(400).json({
                message: "Code must be text"
            });
        }

        const savedCode = new Code({
            code,
            language: language || "javascript",
            userId: req.userId
        });

        await savedCode.save();

        res.status(201).json({
            message: "Code saved successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// LOAD LATEST SAVED CODE
app.get("/saved-code", authMiddleware, async (req, res) => {
    try {
        const savedCode = await Code.findOne({
            userId: req.userId
        }).sort({ _id: -1 });

        if (!savedCode) {
            return res.json({
                message: "No saved code found"
            });
        }

        res.json(savedCode);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


 // RUN CODE API

app.post("/run-code", async (req, res) => {
    try {
        const { code, language } = req.body;

        const languageIds = {
            python: 71,
            java: 62,
            cpp: 54
        };

        const languageId = languageIds[language];

        if (typeof code !== "string" || !languageId) {
            return res.status(400).json({
                message: "Invalid code or language"
            });
        }
        const submissionResponse = await fetch(
            "https://ce.judge0.com/submissions?base64_encoded=false&wait=false",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: languageId
                })
            }
        );
        console.log("Judge0 status:", submissionResponse.status);
        console.log("Judge0 content type:", submissionResponse.headers.get("content-type"));

        const responseText = await submissionResponse.text();

console.log("Judge0 response:", responseText.slice(0, 500));

let submission;

try {
    submission = JSON.parse(responseText);
} catch {
    return res.status(502).json({
        message: "Judge0 returned a non-JSON response",
        details: responseText.slice(0, 200)
    });
}
        if (!submissionResponse.ok || !submission.token) {
            return res.status(502).json({
                message: submission.error || "Compiler submission failed"
            });
        }

        let result;

        for (let i = 0; i < 15; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const resultResponse = await fetch(
                `https://ce.judge0.com/submissions/${submission.token}?base64_encoded=false`
            );

            result = await resultResponse.json();

            if (!resultResponse.ok) {
                return res.status(502).json({
                    message: result.message || "Could not get execution result"
                });
            }

            if (result.status && result.status.id > 2) {
                break;
            }
        }

        if (!result?.status || result.status.id <= 2) {
            return res.status(504).json({
                message: "Execution timed out. Please try again."
            });
        }

        res.json({
            output: result.stdout || "",
            error: result.stderr || result.compile_output ||
                (result.status.id >= 5 ? result.status.description : ""),
            status: result.status.description
        });

    } catch (error) {
        console.error("Compiler error:", error);

        res.status(502).json({
            message: "Compiler service unavailable"
        });
    }
});


// SOCKET.IO EVENTS
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", async (roomId) => {
        if (typeof roomId !== "string" || !roomId.trim()) {
            return;
        }

        // Leave previous rooms
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }

        const selectedRoom = roomId.trim();
        socket.data.roomId = selectedRoom;
        socket.join(selectedRoom);

        try {
            let roomCode = await RoomCode.findOne({
                roomId: selectedRoom
            });

            if (!roomCode) {
                roomCode = await RoomCode.create({
                    roomId: selectedRoom,
                    code: "",
                    language: "javascript"
                });
            }

            socket.emit("room-code", {
                code: roomCode.code,
                language: roomCode.language
            });

            console.log(`${socket.id} joined room ${selectedRoom}`);
        } catch (error) {
            console.error("Room code load error:", error.message);
        }
    });

    // LEAVE ROOM
    socket.on("leave-room", () => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }

        socket.data.roomId = null;
        console.log(`${socket.id} left the room`);
    });

    // SAVE AND SHARE ROOM CODE
    socket.on("code-change", async (data) => {
        if (
            !data ||
            typeof data.code !== "string" ||
            typeof data.roomId !== "string" ||
            !socket.data.roomId ||
            data.roomId.trim() !== socket.data.roomId
        ) {
            return;
        }

        const roomId = socket.data.roomId;
        const language = data.language || "javascript";

        try {
            await RoomCode.findOneAndUpdate(
                { roomId },
                { code: data.code, language },
                { upsert: true, new: true, runValidators: true }
            );

            socket.to(roomId).emit("code-update", {
                code: data.code,
                language
            });
        } catch (error) {
            console.error("Room code save error:", error.message);
        }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// MONGODB CONNECTION AND SERVER START
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });
