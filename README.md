# Collaborative Code Editor

A web-based collaborative code editor built using the MERN stack. It provides a coding environment where users can write, run, save, and load code, collaborate through rooms, and use AI assistance to understand or improve their code.

## Live Demo

[Open Collaborative Code Editor](https://collaborative-code-editor-frontend-yt8h.onrender.com)

## Features

- **User Authentication:** Register and log in with your own account.
- **Online Code Editor:** Write code using the Monaco Editor.
- **Multiple Languages:** Work with JavaScript, Java, Python, and C++.
- **Run Code:** Execute supported code and view the output.
- **Save and Load Code:** Save your code and retrieve it later.
- **Collaborative Rooms:** Join a room and share code updates with other connected users.
- **AI Code Explanation:** Get AI-generated explanations of your code.
- **AI Code Fixing:** Get suggestions for fixing code and apply the corrected code in the editor.
- **Responsive Interface:** Access the application through a web browser on desktop or mobile.

## Tech Stack

**Frontend**
- React.js
- Vite
- Monaco Editor
- JavaScript
- HTML5 and CSS3

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Socket.IO
- AI API integration

## Project Structure

```text
Collaborative-Code-Editor/
├── client/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── models/
│   ├── middleware/
│   ├── app.js
│   └── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/devbyMadhu99/Collaborative-Code-Editor.git
cd Collaborative-Code-Editor
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Configure the frontend API URL using the backend URL in your environment configuration.

### 3. Start the frontend

```bash
npm run dev
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

Configure the required backend settings, including your MongoDB connection and authentication and AI credentials, using environment variables where supported.

### 5. Start the backend

Run the start command configured in `server/package.json`.

## How to Use

1. Open the application.
2. Register a new account and log in.
3. Write code in the editor and select a language.
4. Run your code and check the output.
5. Save your code or load previously saved code.
6. Join a room to collaborate with another connected user.
7. Use **Explain Code** or **Fix Code** for AI assistance.

## Future Improvements

- Real-time collaborative editing with improved synchronization.
- Better code execution error handling.
- Enhanced user dashboards and code management.
- Additional programming languages and editor features.

## Author

**Madhu Yadav**

- GitHub: [@devbyMadhu99](https://github.com/devbyMadhu99)
- LinkedIn: [Madhu Yadav](https://www.linkedin.com/in/madhu-yadav-73093342a/)

---

This project was built to practice full-stack development, authentication, database integration, real-time communication, and AI-assisted coding.

