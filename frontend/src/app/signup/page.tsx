"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./auth.css";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-container">
        <div className="background-decoration">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h1 className="success-title">Welcome Aboard!</h1>
          <p className="success-message">
            Your account has been created successfully.
          </p>
          <div className="success-redirect">
            <div className="loading-spinner"></div>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-icon">
            <span>🚀</span>
          </div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">
            Join us and start your journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                required
                onChange={handleChange}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="signup-button">
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="button-arrow">🚀</span>
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>Already have an account?</span>
        </div>

        <button onClick={() => router.push("/login")} className="login-link">
          Sign in to your account
        </button>

        <div className="features-section">
          <div className="feature-item">
            <span className="feature-icon">🔐</span>
            <span className="feature-text">Secure & Private</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Fast Setup</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Easy to Use</span>
          </div>
        </div>
      </div>
    </div>
  );
}
