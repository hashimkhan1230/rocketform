import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Get name from Firebase profile
      const name =
        userCredential.user.displayName ||
        userCredential.user.email.split("@")[0];

      setUserName(name);
      setSuccess(true);

      // ⏳ Redirect after 2 sec
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      setError("Invalid email or password");
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
            <p>Your account has been logged in successfully.</p>
          </div>
        ) : (
          <>
            <h2>Login</h2>
            <p>Access your RocketForm account</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
