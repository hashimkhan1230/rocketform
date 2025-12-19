import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔍 Find user by UserID
      const q = query(
        collection(db, "users"),
        where("userId", "==", userId.toLowerCase())
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      const userData = snap.docs[0].data();
      const email = userData.email;

      // 🔐 Login with email + password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Get name
      const name =
        userCredential.user.displayName ||
        userData.name ||
        userId;

      setUserName(name);
      setSuccess(true);

      // ⏳ Redirect after 3 sec
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (err) {
      setError("Invalid User ID or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {success ? (
          <div className="success-box">
            <h2>👋 Welcome back, {userName}</h2>
            <p>You have logged in successfully.</p>
          </div>
        ) : (
          <>
            <h2>Login</h2>
            <p>Login using your User ID</p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && <p className="error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
