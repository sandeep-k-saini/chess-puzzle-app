'use client';

import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';

// Navigation items with icons as images
const navItems = [
  { icon: <img src="./Images/Container.svg" alt="" style={{ width: 22, height: 22 }} />, label: "Home" },
  { icon: <img src="./Images/Container (1).svg" alt="" style={{ width: 21, height: 21, marginRight: 5 }} />, label: "Training" },
  { icon: <img src="./Images/Container (2).svg" alt="" style={{ width: 21, height: 21, marginRight: 5 }} />, label: "Puzzles" },
  { icon: <img src="./Images/Container (3).svg" alt="" style={{ width: 21, height: 21, marginRight: 5 }} />, label: "Community" },
  { icon: <img src="./Images/Container (4).svg" alt="" style={{ width: 21, height: 21, marginRight: 5 }} />, label: "Openings" },
  { icon: <img src="./Images/Container (5).svg" alt="" style={{ width: 21, height: 21, marginRight: 5 }} />, label: "Coaching" },
];

// Define props interface for IconBox
interface IconBoxProps {
  onClick: () => void;
  collapsed: boolean;
}

// Toggle Icon Box - shows toggle button when sidebar is collapsed or expanded
const IconBox: React.FC<IconBoxProps> = ({ onClick, collapsed }) => (
  <div
    onClick={onClick}
    style={{
      marginLeft: 16,
      width: 23,
      height: 23,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      border: "2px solid #AAA",
      background: "#fafafa",
      cursor: "pointer",
      userSelect: "none"
    }}
  >
    <img src="./Images/Group 2085664720.svg" alt="Toggle Sidebar" style={{ width: 13, height: 13 }} />
  </div>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth <= 776;  // Changed from 600 to 776
    setIsMobile(mobile);
    if (mobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };
  handleResize();

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  // Click handler for nav items - on mobile, open sidebar if collapsed
  const navItemClick = () => {
    if (collapsed && isMobile) setCollapsed(false);
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      style={{
        position: isMobile ? "fixed" : "relative",
        top: 0,
        left: 0,
        height: "100vh",
        width: collapsed ? 70 : 240,
        minWidth: collapsed ? 70 : 240,
        background: "#fff",
        borderRight: "1px solid #eee",
        boxSizing: "border-box",
        overflowY: "auto",
        zIndex: 1000,
        transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.3s ease, width 0.18s"
      }}
    >
      {/* Logo and Toggle Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "18px 14px 0 14px",
          borderBottom: "1px solid #eee",
        }}
      >
        <span role="img" aria-label="rocket" style={{ fontSize: collapsed ? 30 : 28 }}>
          🚀
        </span>
        {!collapsed && (
          <span style={{ fontWeight: 900, fontSize: 15, fontStyle: "italic", marginLeft: 7, letterSpacing: 1 }}>
            CHESS ROCKET
          </span>
        )}
        {/* Toggle button always visible */}
        <IconBox onClick={toggleSidebar} collapsed={collapsed} />
      </div>

      {/* Profile Section - visible only if not collapsed */}
      {!collapsed && (
        <div
          style={{
            padding: "18px 14px 8px 14px",
            borderBottom: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="flex gap-2 w-full" style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src="./Images/customer-1 1.png"
                alt="Avatar"
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 7,
                  background: "#e8e8e8",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 0,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: "#43db77",
                  border: "2.5px solid #fff",
                  boxSizing: "border-box",
                  display: "inline-block",
                }}
              ></span>
            </div>
            <div className="p-2" style={{ padding: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 18, marginRight: 5 }}>Kenny</span>
                <span style={{ fontSize: 14 }}>🇺🇸</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#000000",
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                Edit Profile
                <EditIcon style={{ fontSize: 13, marginLeft: 4, color: "#000000" }} />
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1px solid #e8e8e8",
              padding: "6px 10px",
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span style={{ color: "#727272" }}>Current Level</span>
            <span>
              <span style={{ color: "#101010", fontWeight: 700, marginRight: 2 }}>12</span>
              <span role="img" aria-label="trophy" style={{ fontSize: 15 }}>
                🏆
              </span>
            </span>
          </div>

          <div
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1px solid #e8e8e8",
              padding: "6px 10px",
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span style={{ color: "#727272" }}>Total Puzzles</span>
            <span>
              <span style={{ color: "#101010", fontWeight: 700, marginRight: 2 }}>569</span>
              <span role="img" aria-label="puzzle" style={{ fontSize: 15 }}>
                🧩
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <div
        style={{
          padding: collapsed ? "18px 0 0 0" : "20px 0 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {navItems.map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: collapsed ? "12px 0 12px 0" : "10px 30px",
              cursor: "pointer",
              fontSize: 15,
              color: "#6F767E",
              borderRadius: 7,
              marginBottom: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "background 0.18s",
            }}
            onClick={navItemClick}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {icon}
            {!collapsed && <span style={{ marginRight: 5, fontWeight: 600 }}>{label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
