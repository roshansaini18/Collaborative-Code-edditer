import React, { useState, useEffect } from 'react';
import Logout from "../components/Logout"
import Dashboard from '../components/Dashboard'; // Corrected to use Dashboard
import './index.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Checks for a stored user on initial load to maintain login state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setLoggedInUser(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    // Saves user data to local storage and updates state
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    // Clears user data from local storage and updates state
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  // Renders either the Home page (login) or the Dashboard (after login)
  if (isLoggedIn) {
    return <Dashboard user={loggedInUser} onLogout={handleLogout} />;
  }
  return <Logout onLoginSuccess={handleLoginSuccess} />;
};

export default App;
