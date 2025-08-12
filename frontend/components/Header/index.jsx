// frontend/src/components/Header.js
import React from 'react';
import { FaSignOutAlt, FaShareAlt, FaUsers, FaBars,FaComments } from 'react-icons/fa';

const Header = ({ roomId, userProfile, userCount, onLeave, onLogout, handleCopyId, toggleSidebar, toggleChat }) => {
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white p-4 shadow-md">
      {/* Left side: Room Info & Actions */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold tracking-tight">Code Room</h1>
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-gray-400">Room ID:</span>
          <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded-md">{roomId}</span>
          <button 
            onClick={handleCopyId}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Copy Room ID"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      {/* Center: User Count */}
      <div className="hidden lg:flex items-center space-x-2 text-gray-400">
        <FaUsers />
        <span className="font-semibold text-lg">{userCount}</span>
        <span className="text-sm">users online</span>
      </div>

      {/* Right side: User Profile & Actions */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {userProfile?.avatar && (
            <img 
              src={userProfile.avatar} 
              alt={`${userProfile.userName}'s avatar`} 
              className="w-8 h-8 rounded-full" 
            />
          )}
          <span className="hidden md:block text-sm font-medium">{userProfile?.userName || 'Anonymous'}</span>
        </div>
        <button
  onClick={toggleChat}
  className="p-2 text-gray-400 hover:text-white transition-colors"
  aria-label="Toggle chat"
>
  <FaComments size={20} />
</button>
        <button 
          onClick={onLeave} 
          className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors hidden md:block"
        >
          Leave Room
        </button>
        <button 
          onClick={onLogout} 
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle chat sidebar"
        >
          <FaBars size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
