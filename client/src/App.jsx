import ActionButtons from "./components/ActionButtons";
import RoomControls from "./components/RoomControls";
import OutputPanel from "./components/OutputPanel";
import EditorPanel from "./components/EditorPanel";
import AuthForm from "./components/AuthForm";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
  console.log("API URL:", API_URL);

const socket = io(API_URL, {
  autoConnect: false,
});

function App() {
  const [code, setCode] = useState(
    'const name = "Madhu";\nconsole.log(name);'
  );
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFixedCode, setAiFixedCode] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roomId, setRoomId] = useState("room1");
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    if (!token) return;

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleCodeUpdate = (data) => {
      if (data.code !== undefined) setCode(data.code);
      if (data.language) setLanguage(data.language);
    };

    const handleRoomCode = (data) => {
      if (data.code !== undefined) setCode(data.code);
      if (data.language) setLanguage(data.language);
    };

    socket.on("connect", handleConnect);
    socket.on("code-update", handleCodeUpdate);
    socket.on("room-code", handleRoomCode);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("code-update", handleCodeUpdate);
      socket.off("room-code", handleRoomCode);
      socket.disconnect();
    };
  }, [token]);

  async function handleAuth(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned an empty or invalid response"
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (isLogin) {
        if (!data.token) {
          throw new Error("Login token not received");
        }

        localStorage.setItem("token", data.token);
        setToken(data.token);
        alert("Login successful!");
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function joinRoom() {
    const selectedRoom = roomId.trim();

    if (!selectedRoom) {
      alert("Please enter a room ID");
      return;
    }

    if (!socket.connected) {
      alert("Server connection is not ready. Please try again.");
      return;
    }

    if (joinedRoom) {
      socket.emit("leave-room");
    }

    socket.emit("join-room", selectedRoom);
    setRoomId(selectedRoom);
    setJoinedRoom(true);

    alert("Joined room: " + selectedRoom);
  }

  function handleCodeChange(value) {
    const newCode = value ?? "";
    setCode(newCode);

    if (joinedRoom && socket.connected) {
      socket.emit("code-change", {
        roomId: roomId.trim(),
        code: newCode,
        language,
      });
    }
  }

  function handleLanguageChange(value) {
    setLanguage(value);

    if (joinedRoom && socket.connected) {
      socket.emit("code-change", {
        roomId: roomId.trim(),
        code,
        language: value,
      });
    }
  }

  function logout() {
    socket.disconnect();
    localStorage.removeItem("token");
    setToken("");
    setCode("");
    setLanguage("javascript");
    setOutput("");
    setSaving(false);
    setEmail("");
    setPassword("");
    setUsername("");
    setJoinedRoom(false);
    alert("Logged out successfully");
  }

  async function saveCode() {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/save-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to save code"
        );
      }

      alert(data.message || "Code saved successfully!");
    } catch (error) {
      alert("Save failed: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function loadCode() {
    try {
      const response = await fetch(`${API_URL}/saved-code`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load code");
      }

      if (data.code !== undefined && data.code !== null) {
        setCode(data.code);
        setLanguage(data.language || "javascript");
        alert("Saved code loaded successfully!");
      } else {
        alert(data.message || "No saved code found.");
      }
    } catch (error) {
      alert("Load failed: " + error.message);
    }
  }

  async function runCode() {
    if (language === "javascript") {
      const logs = [];

      const customConsole = {
        log: (...args) => {
          logs.push(
            args
              .map((value) =>
                typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)
              )
              .join(" ")
          );
        },
      };

      try {
        new Function("console", code)(customConsole);
        setOutput(
          logs.join("\n") || "Code executed successfully."
        );
      } catch (error) {
        setOutput("Error: " + error.message);
      }

      return;
    }

    setOutput("Running code...");

    try {
      const response = await fetch(`${API_URL}/run-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code execution failed");
      }

      setOutput(
        data.error
          ? `Error:\n${data.error}`
          : data.output || data.status || "Execution completed."
      );
    } catch (error) {
      setOutput("Execution failed: " + error.message);
    }
  }

  async function handleAI(action) {
    if (!code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    setAiLoading(true);
    setAiFixedCode("");
    setOutput(
      action === "explain"
        ? "AI is explaining your code..."
        : "AI is reviewing your code..."
    );

    try {
      const response = await fetch(`${API_URL}/ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      const answer = data.answer || "AI returned no response.";
      setOutput(answer);

      if (action === "fix") {
        const match = answer.match(/```[^\n]*\n([\s\S]*?)```/);
        setAiFixedCode(match ? match[1].trim() : "");
      } else {
        setAiFixedCode("");
      }
    } catch (error) {
      setOutput("AI Error: " + error.message);
    } finally {
      setAiLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
      />
    );
  }

  return (
    <div className="editor-page">
      <h1>Collaborative Code Editor</h1>

      <button onClick={logout}>Logout</button>

      <RoomControls
        roomId={roomId}
        setRoomId={(value) => {
          setRoomId(value);
          setJoinedRoom(false);
        }}
        joinedRoom={joinedRoom}
        joinRoom={joinRoom}
      />

      <EditorPanel
        code={code}
        language={language}
        handleCodeChange={handleCodeChange}
        handleLanguageChange={handleLanguageChange}
      />

      <ActionButtons
        runCode={runCode}
        saveCode={saveCode}
        loadCode={loadCode}
        saving={saving}
      />

      <div className="ai-controls">
        <button
          onClick={() => handleAI("explain")}
          disabled={aiLoading}
        >
          {aiLoading ? "AI Working..." : "✨ Explain Code"}
        </button>

        <button
          onClick={() => handleAI("fix")}
          disabled={aiLoading}
        >
          🛠️ Fix Code
        </button>

        {aiFixedCode && (
          <button
            onClick={() => {
              handleCodeChange(aiFixedCode);
              setAiFixedCode("");
              setOutput(
                "Corrected code applied! Now click Run Code."
              );
            }}
          >
            ✅ Apply Fixed Code
          </button>
        )}
      </div>

      <OutputPanel output={output} />
    </div>
  );
}

export default App;