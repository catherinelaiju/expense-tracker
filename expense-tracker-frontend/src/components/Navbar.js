import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // go home after logout
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/assets/logo.png" alt="Xpenzo Logo" className="logo-img" />
        <img src="/assets/header.png" alt="Xpenzo Header" className="header-img" />
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
          Analytics
        </NavLink>

        {!user ? (
          <NavLink to="/auth" className={({ isActive }) => (isActive ? "active" : "")}>
            Login
          </NavLink>
        ) : (
          <>
            <span style={{ marginLeft: "1rem", fontWeight: "500" }}>
              Welcome, {user.email}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
