import { useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function EmailOTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const verifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("Session expired. Please sign up again.");
        return;
      }

      const otpRef = doc(db, "emailOtps", uid);
      const snap = await getDoc(otpRef);

      if (!snap.exists()) {
        setError("OTP expired or invalid.");
        return;
      }

      if (snap.data().otp === otp) {
        // ✅ Mark email verified
        await updateDoc(doc(db, "users", uid), {
          emailVerified: true,
        });

        // ✅ Delete OTP
        await deleteDoc(otpRef);

        // ✅ Show success message
        setSuccess(true);

        // ⏳ Redirect to login after 3 sec
        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } else {
        setError("Incorrect OTP. Please try again.");
      }

    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {success ? (
          <div className="success-box">
            <h2>✅ Verification Successful</h2>
            <p>
              Your OTP verification was successful.
              <br />
              You can now log in to your account.
            </p>
          </div>
        ) : (
          <>
            <h2>Email Verification</h2>
            <p>Enter the OTP sent to your email</p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            {error && <p className="error">{error}</p>}
          </>
        )}

      </div>
    </div>
  );
}
