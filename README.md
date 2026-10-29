# 💬 QuickChat — Real-Time Chat Application

### Connect. Communicate. Collaborate.

A full-stack messaging application built with the **MERN stack and Socket.IO**, designed to deliver a seamless real-time communication experience with private conversations, group messaging, user presence, and media sharing.

QuickChat combines a responsive React interface with a Node.js and Express backend, MongoDB persistence, and real-time communication to provide an interactive messaging experience.

<p align="center">
  <a href="https://github.com/gungunsingh66/chat-app">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
  <img src="https://img.shields.io/badge/Stack-MERN-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack"/>
  <img src="https://img.shields.io/badge/Real--Time-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| 💻 Source Code | [View on GitHub](https://github.com/gungunsingh66/chat-app) |
| 🌐 Live Application | [Open QuickChat](https://chat-app-chi-nine-20.vercel.app/)

---

## ✨ Key Features

### 💬 Real-Time Messaging
- Send and receive messages through real-time communication using Socket.IO.
- Keep conversations interactive without relying exclusively on page refreshes.
- Retrieve and display conversation data through backend APIs.

### 👥 Private & Group Conversations
- Support one-to-one messaging between users.
- Create and manage group conversations.
- Organize conversations for a more intuitive messaging experience.
- Manage group members and group-related interactions.

### 🔐 Authentication & Protected APIs
- Authenticate users through the application's authentication flow.
- Protect relevant backend routes against unauthorized access.
- Integrate frontend requests with backend authentication.

### 🟢 Online User Presence
- Track user connectivity through the real-time communication layer.
- Reflect online-user information in the messaging interface.

### 🖼️ Image & Media Sharing
- Share images within supported conversations.
- Integrate Cloudinary for media storage and delivery.
- Display shared media within the chat interface.

### 🎨 Responsive User Interface
- Build reusable React components for the messaging experience.
- Manage chat selection, conversation views, and user information.
- Organize the interface into focused components for easier maintenance.
- Support responsive layouts across different screen sizes.

### 🗄️ Persistent Data Storage
- Use MongoDB to store application data.
- Use Mongoose to structure database interactions.
- Retrieve conversations and messages through backend endpoints.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-Time Communication | Socket.IO, Socket.IO Client |
| Authentication | JSON Web Tokens (JWT) |
| Media Management | Cloudinary, Multer |
| API Communication | REST APIs, Axios |
| Development Tools | Git, GitHub, VS Code |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## 🏗️ Application Architecture

QuickChat follows a client-server architecture that separates the user interface, backend business logic, persistent storage, and real-time communication.

```text
                    ┌──────────────────────┐
                    │      React Client    │
                    │                      │
                    │  Chat UI & Components│
                    │  State Management    │
                    └──────────┬───────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
             REST API                 Socket.IO
                  │                         │
                  ▼                         ▼
          ┌──────────────────────────────────┐
          │        Node.js + Express         │
          │                                  │
          │  Authentication & Authorization │
          │  API Routes & Controllers        │
          │  Messaging & Group Operations    │
          └──────────────┬───────────────────┘
                         │
               ┌─────────┴──────────┐
               │                    │
               ▼                    ▼
        ┌─────────────┐     ┌────────────────┐
        │   MongoDB   │     │   Cloudinary   │
        │ Application │     │ Media Storage  │
        │    Data     │     │                │
        └─────────────┘     └────────────────┘
```

### How It Works

1. **User interaction:** Users interact with the React interface to navigate conversations and send messages.
2. **API communication:** The frontend communicates with Express endpoints to perform supported application operations.
3. **Real-time events:** Socket.IO handles real-time communication between connected clients and the server.
4. **Data persistence:** MongoDB stores application data so supported information can be retrieved later.
5. **Media handling:** Cloudinary manages supported image uploads and media delivery.

---

## 📂 Project Structure

The repository separates the frontend and backend into independent applications.

```text
chat-app/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── server/
│   ├── ...
│   └── package.json
│
└── README.md
```

*The tree above is a simplified overview. Refer to the repository for the complete directory structure.*

---

## ⚙️ Getting Started

Follow these steps to run QuickChat locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A MongoDB instance or MongoDB Atlas account
- A Cloudinary account for media functionality

### 1. Clone the Repository

```bash
git clone https://github.com/gungunsingh66/chat-app.git
cd chat-app
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file in the backend directory.

Add the environment variables required by your server configuration. For example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Important:** These variable names are illustrative. Check your backend configuration and use the exact names your application expects. Never commit your actual `.env` file or credentials.

Start the backend using the script defined in `server/package.json`. For example:

```bash
npm run dev
```

If your project uses a different script, run the appropriate command.

### 3. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
```

Configure the frontend environment variables required by your application, including the backend API URL and any Socket.IO connection URL if applicable.

For a Vite application, environment variables exposed to client-side code must use the `VITE_` prefix.

For example:

```env
VITE_API_URL=http://localhost:5000
```

Use the variable names expected by your existing frontend code.

### 4. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

Your backend, database, and media configuration must be available for the corresponding features to work.

---

## 🔌 Real-Time Communication

Socket.IO is an important part of QuickChat's messaging architecture.

Instead of relying exclusively on repeated HTTP requests, the application uses Socket.IO to support event-driven communication between connected clients and the backend.

The real-time communication layer supports messaging and the application's user-presence functionality.

The backend uses an HTTP server to support Express and Socket.IO together, allowing HTTP endpoints and real-time connections to operate through the same server.

---

## 🔒 Security Considerations

The application integrates authentication and protected backend operations as part of its client-server architecture.

Important security considerations for a production deployment include:

- Validating incoming API requests on the server.
- En
