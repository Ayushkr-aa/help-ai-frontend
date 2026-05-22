import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";
import "./Auth.css";

export default function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user);
      }
    } catch (err) {
      console.error(err);
      // Clean up common firebase errors
      const friendlyMsg = err.code
        ? err.code.replace("auth/", "").replaceAll("-", " ")
        : err.message;
      setError(friendlyMsg.charAt(0).toUpperCase() + friendlyMsg.slice(1));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (onAuthSuccess) {
        onAuthSuccess(userCredential.user);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">🧘</div>
          <h2>{isSignUp ? "Begin Your Journey" : "Welcome Back"}</h2>
          <p className="auth-subtitle">
            {isSignUp 
              ? "Create your spiritual wellness account" 
              : "Reconnect with scripture & modern guidance"}
          </p>
        </div>

        {error && <div className="auth-error-badge">{error}</div>}

        <form onSubmit={handleEmailAuth} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignUp && (
            <div className="auth-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="auth-btn auth-btn-primary" 
            disabled={loading}
          >
            {loading ? "Aligning..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          className="auth-btn auth-btn-google"
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.355-2.845-6.355-6.355s2.845-6.355 6.355-6.355c1.61 0 3.08.6 4.22 1.58l3.19-3.19C19.23 2.14 15.94 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.82-4.148 10.82-10.82 0-.68-.06-1.336-.17-1.975H12.24z"/>
          </svg>
          Google
        </button>

        <div className="auth-footer">
          <p>
            {isSignUp ? "Already have an account? " : "New to Help.ai? "}
            <button 
              type="button"
              className="auth-toggle-link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
