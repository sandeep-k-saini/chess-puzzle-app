import React from "react";

// Example props (customize as needed)
const lessonTitle = "Rook Endgames: Building a Bridge";
const lessonSubtitle = "Lesson 1 · Level 1 Fundamentals";
const lessonDuration = "45 min lesson";
const puzzleRating = "Puzzle Rating:1204";
const avatarUrl = "./Images/customer-1 1.png"; // Change if you use another path

const Header = () => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 22px",
    background: "#fff",
    borderBottom: "1px solid #f0f0f0",
    minHeight: 56
  }}>
    {/* Left: title/subtitle */}
    <div>
      <div style={{
        fontSize: 20, fontWeight: 700, marginBottom: 2, color: "#232323"
      }}>
        {lessonTitle}
      </div>
      <div style={{ fontSize: 14, color: "#888" }}>
        {lessonSubtitle}
      </div>
    </div>

    {/* Right: badges and avatar */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12
    }}>
      <div style={{
        padding: "7px 13px",
        background: "#f7f7f7",
        borderRadius: 16,
        fontSize: 14,
        color: "#6F767E",
        display: "flex", alignItems: "center",
        gap: 5
      }}>
        <span role="img" aria-label="clock" style={{ fontSize: 14 }}><img src="../Images/Icon.svg" alt="" /></span>
        {lessonDuration}
      </div>
      <div style={{
        padding: "7px 13px",
        background: "#EEF2FF",
        borderRadius: 16,
        fontSize: 14,
        color: "#4F39F6",
        fontWeight: 600,
        display: "flex", alignItems: "center",
        gap: 6,
      }}>
        <span role="img" aria-label="trophy" style={{ fontSize: 15 }}><img src="../Images/Icon (1).svg" alt="" /></span>
        {puzzleRating}
      </div>
      <img src={avatarUrl} alt="Avatar"
        style={{
          width: 34, height: 34,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #f0f0f0"
        }} />
    </div>
  </div>
);

export default Header;
