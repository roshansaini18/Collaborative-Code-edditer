// import React, { useState, useEffect } from 'react';
// import CodeRoom from '../CodeRoom';

// // ✅ Define the API URL once at the top of the file
// const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

// const Dashboard = ({ user, onLogout }) => {
//   const [room, setRoom] = useState(() => {
//     return localStorage.getItem('activeRoom') || null;
//   });

//   useEffect(() => {
//     if (room) {
//       localStorage.setItem('activeRoom', room);
//     } else {
//       localStorage.removeItem('activeRoom');
//     }
//   }, [room]);

//   const handleCreateRoom = async () => {
//     try {
//       // Now you can just use the 'apiUrl' constant
//       const response = await fetch(`${apiUrl}/api/create-room`, { method: 'POST' });
//       if (!response.ok) {
//         throw new Error('Failed to create room on the server.');
//       }
//       const data = await response.json();
//       setRoom(data.roomId); // This is fine, or you could combine the lines
//       console.log(`Creating and joining new room: ${data.roomId}`);
//     } catch (error) {
//       console.error('Error creating room:', error);
//       alert('Could not create a new room. Please try again later.');
//     }
//   };

//   const handleJoinRoom = async () => {
//     const roomId = prompt('Enter the room ID to join:');
//     if (roomId) {
//       try {
//         // Use the same 'apiUrl' constant here
//         const response = await fetch(`${apiUrl}/api/check-room/${roomId}`);
//         if (response.ok) {
//           setRoom(roomId);
//           console.log(`Joining existing room: ${roomId}`);
//         } else {
//           alert('Room not found. Please check the ID and try again.');
//         }
//       } catch (error) {
//         console.error('Error joining room:', error);
//         alert('An error occurred while trying to join the room.');
//       }
//     }
//   };

//   // ... (The rest of your component's JSX is correct and remains unchanged)

//   if (room) {
//     return (
//       <CodeRoom
//         user={user}
//         roomId={room}
//         onLeave={() => setRoom(null)}
//         onLogout={onLogout}
//       />
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 p-8 font-sans">
//       <header className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">
//             Welcome, {user.userName}!
//           </h1>
//           <p className="text-sm text-gray-600">
//             Logged in as: {user.email}
//           </p>
//         </div>
//         <button
//           onClick={onLogout}
//           className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
//         >
//           Logout
//         </button>
//       </header>
//       <main className="flex-grow flex flex-col bg-white rounded-lg shadow-md overflow-hidden p-8 justify-center items-center">
//         <h2 className="text-xl font-bold text-gray-700 mb-4">
//           Start a new coding session
//         </h2>
//         <div className="flex space-x-4">
//           <button
//             onClick={handleCreateRoom}
//             className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
//           >
//             Create New Room
//           </button>
//           <button
//             onClick={handleJoinRoom}
//             className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Join Existing Room
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import CodeRoom from '../CodeRoom';

// ✅ Define the API URL once at the top of the file
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

const Dashboard = ({ user, onLogout }) => {
  const [room, setRoom] = useState(() => {
    return localStorage.getItem('activeRoom') || null;
  });

  useEffect(() => {
    if (room) {
      localStorage.setItem('activeRoom', room);
    } else {
      localStorage.removeItem('activeRoom');
    }
  }, [room]);

  const handleCreateRoom = async () => {
    try {
      // Now you can just use the 'apiUrl' constant
      const response = await fetch(`${apiUrl}/api/create-room`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to create room on the server.');
      }
      const data = await response.json();
      setRoom(data.roomId); // This is fine, or you could combine the lines
      console.log(`Creating and joining new room: ${data.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Could not create a new room. Please try again later.');
    }
  };

  const handleJoinRoom = async () => {
    const roomId = prompt('Enter the room ID to join:');
    if (roomId) {
      try {
        // Use the same 'apiUrl' constant here
        const response = await fetch(`${apiUrl}/api/check-room/${roomId}`);
        if (response.ok) {
          setRoom(roomId);
          console.log(`Joining existing room: ${roomId}`);
        } else {
          alert('Room not found. Please check the ID and try again.');
        }
      } catch (error) {
        console.error('Error joining room:', error);
        alert('An error occurred while trying to join the room.');
      }
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
    // Adjusted padding for smaller screens
    <div className="flex flex-col h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      {/* Header stacks vertically on small screens, row on larger screens */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white shadow-md rounded-lg mb-4 gap-3 sm:gap-0">
        <div>
          {/* Slightly smaller text on mobile */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
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
      {/* Adjusted padding for smaller screens */}
      <main className="flex-grow flex flex-col bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-8 justify-center items-center">
        <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
          Start a new coding session
        </h2>
        {/* Buttons stack vertically on small screens, row on larger screens */}
        <div className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-none sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
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
