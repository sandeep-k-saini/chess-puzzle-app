'use client';

import React, { useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExtensionIcon from '@mui/icons-material/Extension';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import ProfileImage from '../public/Images/customer-1 1.png';

const navItems = [
  { icon: <HomeIcon style={{ fontSize: 24 }}/>, label: "Home" },
  { icon: <MenuBookIcon style={{ fontSize: 24 }}/>, label: "Training" },
  { icon: <ExtensionIcon style={{ fontSize: 24 }}/>, label: "Puzzles" },
  { icon: <GroupIcon style={{ fontSize: 24 }}/>, label: "Community" },
  { icon: <BookIcon style={{ fontSize: 24 }}/>, label: "Openings" },
  { icon: <SchoolIcon style={{ fontSize: 24 }}/>, label: "Coaching" },
];

// Toggle Icon Box
const IconBox = ({ onClick, collapsed }) => (
  <div
    onClick={onClick}
    style={{
      marginLeft: 16,
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 7,
      border: "2px solid #AAA",
      background: "#fafafa",
      cursor: "pointer"
    }}
  >
    <span style={{
      color: "#666",
      fontSize: 18,
      fontWeight: 500,
      fontFamily: "monospace"
    }}>
      {collapsed ? "⟶" : "K"}
    </span>
  </div>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? 70 : 240,
        minWidth: collapsed ? 70 : 240,
        background: "#fff",
        height: "100vh",
        borderRight: "1px solid #eee",
        transition: "width 0.18s",
        boxSizing: "border-box"
      }}
    >
      {/* Logo and Toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        padding: "18px 14px 0 14px",
        borderBottom: "1px solid #eee"
      }}>
        <span role="img" aria-label="rocket" style={{ fontSize: collapsed ? 30 : 28 }}>🚀</span>
        {!collapsed && (
          <span style={{
            fontWeight: 900,
            fontSize: 12,
            fontStyle: "italic",
            marginLeft: 7,
            letterSpacing: 1
          }}>CHESS ROCKET</span>
        )}
        <IconBox onClick={() => setCollapsed(c => !c)} collapsed={collapsed} />
      </div>

      {/* Profile Section */}
      {!collapsed && (
        <div style={{
          padding: "18px 14px 8px 14px",
          borderBottom: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <img src="./Images/customer-1 1.png" alt="Avatar"
            style={{
              width: 44, height: 44,
              borderRadius: "50%", objectFit: "cover",
              marginBottom: 7, background: "#e8e8e8"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontWeight: 600, fontSize: 14, marginRight: 5 }}>Kenny</span>
            <span style={{ fontSize: 14 }}>🇺🇸</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "#666", fontSize: 11, marginBottom: 10 }}>
            Edit Profile
            <EditIcon style={{ fontSize: 13, marginLeft: 4, color: "#444" }} />
          </div>
          {/* Stats Cards */}
          <div style={{
            width: "100%",
            background: "#fafbfc",
            borderRadius: 10,
            padding: "6px 10px",
            marginBottom: 6,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 15,
            fontWeight: 500,
            boxShadow: "0 1px 3px #eee"
          }}>
            <span style={{ color: "#888" }}>Current Level</span>
            <span>
              <span style={{ color: "#333", fontWeight: 700, marginRight: 2 }}>12</span>
              <span role="img" aria-label="trophy" style={{fontSize: 15}}>🏆</span>
            </span>
          </div>
          <div style={{
            width: "100%",
            background: "#fafbfc",
            borderRadius: 10,
            padding: "6px 10px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 15,
            fontWeight: 500,
            boxShadow: "0 1px 3px #eee"
          }}>
            <span style={{ color: "#888" }}>Total Puzzles</span>
            <span>
              <span style={{ color: "#22aa44", fontWeight: 700, marginRight: 2 }}>569</span>
              <span role="img" aria-label="puzzle" style={{fontSize: 15}}>🧩</span>
            </span>
          </div>
        </div>
      )}

      {/* Navigation section */}
      <div style={{
        padding: collapsed ? "18px 0 0 0" : "20px 0 0 0",
        display: "flex", flexDirection: "column",
        alignItems: "flex-start"
      }}>
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
              color: "#666",
              borderRadius: 7,
              marginBottom: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "background 0.18s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
