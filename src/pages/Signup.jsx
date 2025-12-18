import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { auth, db } from "../firebase/firebase";
import { generateOtp } from "../utils/generateOtp";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Create user (Email + Password)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Save display name
      await updateProfile(user, { displayName: name });

      // 3️⃣ Generate 6-digit OTP
      const otp = generateOtp();
      console.log("OTP GENERATED:", otp);

      // 4️⃣ Save user data
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        userId,
        email,
        phone,
        emailVerified: false,
        createdAt: new Date(),
      });

      // 5️⃣ Save OTP in Firestore
      await setDoc(doc(db, "emailOtps", user.uid), {
        otp,
        createdAt: Date.now(),
      });

      // 6️⃣ Send OTP email via EmailJS
      const res = await emailjs.send(
        "service_p1yo6hh",
        "template_tafwe72",
        {
          to_email: email,
          otp: otp,
        },
        "7Lfk7xzu-w3RRmlba"
      );

      console.log("EMAILJS RESPONSE:", res);

      // 7️⃣ Go to Email OTP verification page
      navigate("/otp-verification");

    } catch (err) {
      console.error(err);
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Email OTP verification required</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Choose User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value.toLowerCase())}
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

          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
