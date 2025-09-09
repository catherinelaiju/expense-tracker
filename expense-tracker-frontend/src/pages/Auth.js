import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./../App.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // ✅ Save to profiles table
  const saveUserProfile = async (user) => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert([
      {
        id: user.id,
        email: user.email,
        full_name: fullName || user.user_metadata?.full_name || "",
      },
    ]);

    if (error) {
      console.error("Error saving profile:", error.message);
    } else {
      console.log("✅ Profile synced");
    }
  };

  // ✅ Handle Login/Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Login successful 🎉");
        await saveUserProfile(data.user);
        window.location.href = "/dashboard"; // redirect after login
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Registration successful 🎉 Check your email for confirmation.");
        await saveUserProfile(data.user);
        window.location.href = "/dashboard"; // redirect after register
      }
    }
  };

  // ✅ Forgot password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) alert(error.message);
    else alert(`Password reset link sent to ${resetEmail}`);
    setShowReset(false);
    setResetEmail("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          {isLogin
            ? showReset
              ? "Reset Password 🔑"
              : "Welcome Back 👋"
            : "Create an Account 🚀"}
        </h2>

        <form
          className="auth-form"
          onSubmit={showReset ? handleResetSubmit : handleSubmit}
        >
          {!isLogin && !showReset && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          {!showReset && (
            <>
              <input
                type="email"
                placeholder="Email"
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
              <button type="submit" className="btn primary">
                {isLogin ? "Login" : "Register"}
              </button>
            </>
          )}

          {showReset && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn primary">
                Send Reset Link
              </button>
            </>
          )}
        </form>

        {isLogin && !showReset && (
          <p className="forgot-text">
            <button
              type="button"
              className="link-button"
              onClick={() => setShowReset(true)}
            >
              Forgot Password?
            </button>
          </p>
        )}

        <p className="switch-text">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setShowReset(false);
            }}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
