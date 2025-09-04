### `README.md`

# Collaborative-Code-Edditer

An interactive, real-time collaborative coding environment.

## 🚀 Live Demo

[[Live View](https://collaborative-code-kelj.onrender.com/)]

<img width="1917" height="824" alt="Screenshot 2025-09-05 032751" src="https://github.com/user-attachments/assets/e72fd67e-c57b-4efc-88c7-fe81bc183f25" />

<img width="1914" height="830" alt="Screenshot 2025-09-05 032921" src="https://github.com/user-attachments/assets/a5ef9c38-7d19-488e-890c-51190e85fa3d" />

<img width="1919" height="859" alt="Screenshot 2025-09-05 032938" src="https://github.com/user-attachments/assets/ea6f4172-61b9-49a3-adb5-9b9aef8287af" />

<img width="1919" height="865" alt="Screenshot 2025-09-05 033134" src="https://github.com/user-attachments/assets/6c4014d5-41d5-4ad5-a9c0-26ed9ebd05a0" />

## ✨ Features

- **Real-time Code Collaboration:** Edit code simultaneously with other users in a shared room, powered by **Yjs** and **Y-Monaco**.
- **Integrated Chat:** Communicate with your team members directly within the coding session.
- **Live Code Execution:** Run your code and view the output instantly.
- **Customizable Environment:** Switch between different programming languages and editor themes (light/dark).
- **Persistent Sessions:** Your code and chat history are saved for future sessions.
- **Responsive Layout:** The interface adapts to different screen sizes, with resizable panels for a personalized workspace.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | A JavaScript library for building dynamic user interfaces. |
| | **Monaco Editor** | The code editor that powers VS Code, providing a rich coding experience. |
| | **Ant Design** | A UI library for building elegant and professional interfaces. |
| | **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |
| | **Yjs & Y-Monaco** | For state synchronization and real-time collaboration. |
| **Backend** | **Node.js** | A JavaScript runtime for server-side logic. |
| | **Express.js** | A fast, minimalist web framework for building APIs. |
| | **Socket.io** | Enables real-time, bidirectional communication between the clients and server. |
| | **y-websocket** | A WebSocket backend for Yjs to handle collaborative editing. |
| **Database** | **MongoDB (Atlas)** | A NoSQL database used to store project data like chat messages and code. |
| **Compiler API** | **Jdoodle API** | An external service used to compile and run code in multiple languages. |

---

## 🌐 System Architecture

This project follows a client-server architecture. The frontend, built with React, communicates with a Node.js backend. This backend uses Socket.io to manage real-time communication for chat and Y-Websocket for collaborative editing. The server interacts with a **MongoDB** database to persist data and an external compiler API to execute code. 

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies for both frontend and backend:**
    ```bash
    # Install backend dependencies
    npm install
    # Assuming your frontend is in a 'frontend' folder
    cd frontend
    npm install
    ```

3.  **Configure environment variables:**
    Create `.env` files for both your root directory and `frontend` directory based on the provided `.env.example` files. You will need to add your MongoDB connection string and compiler API key to these files.

    **Example `.env` (root):**
    ```
    PORT=3001
    MONGO_URI=your_mongodb_connection_string
    JDOODLE_CLIENT_ID=your_client_id
    JDOODLE_CLIENT_SECRET=your_client_secret
    ```

    **Example `.env` (frontend):**
    ```
    VITE_REACT_APP_SOCKET_URL=http://localhost:3001
    VITE_REACT_APP_YWS_URL=ws://localhost:3001/yws
    VITE_REACT_APP_API_URL=http://localhost:3001
    ```

4.  **Run the application:**
    ```bash
    # Start the backend server
    npm start

    # Open a new terminal, navigate to the frontend directory, and start the client
    cd frontend
    npm run dev
    ```

The application should now be running. The frontend will be available at `http://localhost:5173` (or another port if configured) and the backend at `http://localhost:3001`.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Roshan Saini - roshansainims957178@gmail.com

Project Link: [Github Repo](https://github.com/roshansaini18/Collaborative-Code-edditer)
