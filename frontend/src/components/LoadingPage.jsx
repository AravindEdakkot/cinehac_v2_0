import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection.jsx";
import clapperVideo from "./clapper-box.mp4"; // make sure the video is here

const LoadingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Loading Video Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000", // black background
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <video
            src={clapperVideo}
            autoPlay
            muted
            loop
            style={{ width: "400px", height: "400px", objectFit: "cover" }}
          />
          <p
            style={{
              color: "#fff", // white text
              marginTop: "1rem",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Loading...
          </p>
        </div>
      )}

      {/* Main Hero Section */}
      {!loading && <HeroSection />}
    </div>
  );
};

export default LoadingPage;
