import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDModel from "./ThreeDModel.jsx";

const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014";
const ACCENT_COLOR = "rgba(255, 255, 255, 0.15)";
const HOVER_COLOR = "rgba(255, 255, 255, 0.3)";

const HeroSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Dummy credentials with routes
  const users = {
    director: { password: "dir123", route: "/director" },
    producer: { password: "pro123", route: "/producer" },
    manager: { password: "man123", route: "/manager" },
    accountant: { password: "acc123", route: "/accountant" },
  };

  const handleLogin = () => {
    const user = users[username.toLowerCase()];
    if (user && user.password === password) {
      navigate(user.route);
    } else {
      alert("Invalid username or password!");
    }
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    outline: "none",
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    fontFamily: FONT_FAMILY,
    transition: "0.2s ease-in-out",
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: PRIMARY_BG,
        fontFamily: FONT_FAMILY,
      }}
    >
      <h1
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          fontWeight: 700,
          fontSize: "3rem",
          color: "white",
          zIndex: 10,
          margin: 0,
        }}
      >
        FilmHub
      </h1>

      {/* Login Card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "5vw",
          transform: "translateY(-50%)",
          width: "380px",
          padding: "3rem",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.02)",
          boxShadow: "0 8px 60px 0 rgba(31, 38, 135, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          zIndex: 10,
          color: "white",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center", fontWeight: 600 }}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={{
            ...inputStyle,
            background: isHovering ? HOVER_COLOR : ACCENT_COLOR,
            cursor: "pointer",
            fontWeight: 600,
          }}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          maxWidth: "450px",
          color: "rgba(255, 255, 255, 0.7)",
          fontWeight: 300,
          fontSize: "1.05rem",
          lineHeight: "1.6",
          textAlign: "left",
          zIndex: 10,
          margin: 0,
        }}
      >
        FilmHub is a comprehensive film production management platform that
        streamlines pre-production, production, and post-production processes.
      </p>

      {/* 3D Model Component */}
      <ThreeDModel />
    </div>
  );
};

export default HeroSection;
