# Collaborative Code Editor 🚀

A web-based code editor built with the MERN stack that allows users to write, run, save, and manage code in a single workspace. It also includes user authentication, AI-powered code assistance, and real-time collaboration features.

## 🌐 Live Demo

**[Open Collaborative Code Editor](https://collaborative-code-editor-frontend-yt8h.onrender.com)**

**GitHub Repository:** [Collaborative-Code-Editor](https://github.com/devbyMadhu99/Collaborative-Code-Editor)

## ✨ Features

- **User Authentication:** Register and log in with your own account.
- **Online Code Editor:** Write code using the Monaco Editor.
- **Multiple Languages:** Select JavaScript, Python, Java, or C++.
- **Run Code:** Execute code and view the output.
- **Save and Load Code:** Save your code and retrieve it later.
- **AI Code Explanation:** Get AI-generated explanations of your code.
- **AI Code Fixing:** Get suggestions to help fix code.
- **Real-Time Collaboration:** Join a room to collaborate with others.
- **Responsive Interface:** Access the application from desktop or mobile browsers.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5 and CSS3
- Vite
- Monaco Editor

**Backend**
- Node.js
- Express.js
- Socket.IO

**Database and Authentication**
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Tokens (JWT)

**Additional Tools and Services**
- Gemini API for AI-powered assistance
- Git and GitHub
- Render for deployment

## ⚙️ Run Locally

### Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas connection
- Git

### 1. Clone the repository

```bash
git clone https://github.com/devbyMadhu99/Collaborative-Code-Editor.git
cd Collaborative-Code-Editor
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder and configure the environment variables required by your backend, such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact environment variable names expected by your code. Add any additional variables required by your code execution service.

Start the backend:

```bash
node app.js
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## 🔒 Security Notes

- Never commit API keys, database credentials, or secret keys to GitHub.
- Keep `.env` files out of version control.
- Use environment variables for sensitive configuration.

## 🎯 Project Objective

The goal of this project is to create a convenient coding workspace where users can write, execute, save, and understand code, while exploring real-time collaboration and AI-assisted development.

## 🚀 Future Enhancements

- More programming languages and execution options
- Improved collaboration and room management
- Code history and version tracking
- Enhanced editor themes and customization

## 👩‍💻 Author

**Madhu Yadav**

- GitHub: [@devbyMadhu99](https://github.com/devbyMadhu99)
- LinkedIn: [Madhu Yadav](https://www.linkedin.com/in/madhu-yadav-73093342a)

---

*Built as a full-stack development project to practice React, Node.js, Express, MongoDB, authentication, and real-time communication.*
