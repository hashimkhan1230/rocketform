import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* ✅ LOGO → HOME */}
        <div
          className="navbar-logo"
          onClick={() => {
            navigate("/");
            setOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          Rocket<span>Form</span>
        </div>

        {/* CENTER LINKS */}
        <nav className={`navbar-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>

          {user && (
            <>
              <Link to="/add-post" onClick={() => setOpen(false)}>Add Post</Link>
              <Link to="/add-article" onClick={() => setOpen(false)}>Add Article</Link>
            </>
          )}

          <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>

          {/* 🔽 MOBILE ONLY */}
          {user && (
            <div className="mobile-only">
              <div
                className="mobile-profile"
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="profile-icon">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </div>
                <span>{user.displayName || "User"}</span>
              </div>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="mobile-only">
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
            </div>
          )}
        </nav>

        {/* RIGHT SIDE (DESKTOP ONLY) */}
        {user ? (
          <div className="navbar-right desktop-only">
            {/* ✅ PROFILE ICON → PROFILE PAGE */}
            <div
              className="profile-box"
              onClick={() => navigate("/Profile")}
              style={{ cursor: "pointer" }}
            >
              <div className="profile-icon">
                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
              </div>
              <span className="profile-name">
                {user.displayName || "User"}
              </span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-right desktop-only">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}

        {/* HAMBURGER */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </header>
  );
}
