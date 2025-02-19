import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import '../index.css'

const ProtectedRoute = ({ children }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = "9731"; // Change this to your desired password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password! Redirecting to home.");
      return <Navigate to="/" />;
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="auth-container">
      <h2>Enter Password to Access</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="***"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProtectedRoute;
