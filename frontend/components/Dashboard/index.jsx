import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CodeRoom from '../CodeRoom';

const Dashboard = ({ user, onLogout }) => {
  const [room, setRoom] = useState(() => {
    // Load saved room from localStorage when component mounts
    return localStorage.getItem('activeRoom') || null;
  });

  // Save room to localStorage whenever it changes
  useEffect(() => {
    if (room) {
      localStorage.setItem('activeRoom', room);
    } else {
      localStorage.removeItem('activeRoom');
    }
  }, [room]);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    setRoom(newRoomId);
    console.log(`Creating and joining new room: ${newRoomId}`);
  };

  const handleJoinRoom = () => {
    const roomId = prompt('Enter the room ID to join:');
    if (roomId) {
      setRoom(roomId);
      console.log(`Joining existing room: ${roomId}`);
    }
  };

  if (room) {
    return (
      <CodeRoom
        user={user}
        roomId={room}
        onLeave={() => setRoom(null)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-8 font-sans">
      <header className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.userName}!
          </h1>
          <p className="text-sm text-gray-600">
            Logged in as: {user.email}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow flex flex-col bg-white rounded-lg shadow-md overflow-hidden p-8 justify-center items-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Start a new coding session
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={handleCreateRoom}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Create New Room
          </button>
          <button
            onClick={handleJoinRoom}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Existing Room
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
