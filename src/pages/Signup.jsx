import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // ✅ Success state
      setSuccess(true);

      // ⏳ Redirect to login after 2 sec
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {success ? (
          <div className="success-box">
            <h2>🎉 Account Created!</h2>
            <p>
              Your RocketForm account has been created successfully.
              <br />
              Redirecting to login…
            </p>
          </div>
        ) : (
          <>
            <h2>Create Account</h2>
            <p>Join RocketForm today</p>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {error && <p className="error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
