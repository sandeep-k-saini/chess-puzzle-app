import React, { useState, useEffect } from "react";

const lessonTitle = "Rook Endgames: Building a Bridge";
const lessonSubtitle = "Lesson 1 · Level 1 Fundamentals";
const lessonDuration = "45 min lesson";
const puzzleRating = "Puzzle Rating:1204";
const avatarUrl = "./Images/customer-1 1.png";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        padding: isMobile ? "10px 14px" : "12px 22px",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        minHeight: 56,
        gap: isMobile ? 10 : 0,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Left: title/subtitle */}
      <div
        style={{
          marginBottom: isMobile ? 4 : 0,
          width: isMobile ? "100%" : "auto",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? 18 : 20,
            fontWeight: 700,
            marginBottom: 2,
            color: "#232323",
            wordBreak: "break-word",
          }}
        >
          {lessonTitle}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          {lessonSubtitle}
        </div>
      </div>

      {/* Right: badges and avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: isMobile ? "100%" : "auto",
          justifyContent: isMobile ? "flex-start" : "flex-end",
          flexWrap: "wrap",
          rowGap: 8,
          marginTop: isMobile ? 4 : 0,
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            background: "#f7f7f7",
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 600,
            color: "#6F767E",
            display: "flex",
            alignItems: "center",
            gap: 5,
            whiteSpace: "nowrap",
          }}
        >
          <img src="../Images/Icon.svg" alt="clock icon" style={{ width: 14, height: 14 }} />
          {lessonDuration}
        </div>

        <div
          style={{
            padding: "6px 10px",
            background: "#EEF2FF",
            borderRadius: 16,
            fontSize: 13,
            color: "#4F39F6",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <img src="../Images/Icon (1).svg" alt="trophy icon" style={{ width: 15, height: 15 }} />
          {puzzleRating}
        </div>

        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #f0f0f0",
          }}
        />
      </div>
    </div>
  );
};

export default Header;
