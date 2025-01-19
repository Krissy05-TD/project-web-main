import React, { useState } from "react";
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { getDocs, query, where, collection } from "@firebase/firestore";
import "./style/login.css";

export default function Login() {
  const ref = collection(firestore, "users"); // Query the 'users' collection

  const [firstname, setFirstname] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Example validation logic (customize as needed)
    if (!firstname || !password) {
      setError(true);
      return;
    }

    setError(false);

    try {
      // Query Firestore for the matching user using email and password
      const loginQuery = query(
        ref,
        where("email", "==", firstname.trim()) // Search by email (as stored in Firestore)
      );

      const loginSnapshot = await getDocs(loginQuery);

      if (loginSnapshot.empty) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      // Validate password and fetch user data (firstname, email)
      let userData = null;
      loginSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.password === password.trim()) {
          userData = data;
        }
      });

      if (!userData) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      // Save firstname and email (username) to localStorage
      localStorage.setItem("firstname", userData.firstname || "User");
      localStorage.setItem("email", userData.email); // Assuming email is the username

      console.log("Login successful for:", userData.firstname);
      window.location.href = "/welcomes"; // Redirect to the welcome page
    } catch (e) {
      console.error("Error during login:", e);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login">
      {/* Left Section */}
      <div className="login-left">
        <div>
          <h1>
            <img src="/logo.jpeg" alt="Four Leaf Clover" /> Project 1
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <form id="login-form" onSubmit={handleSave}>
          <div className="one">
            <label htmlFor="firstname" className="user">
              Username
            </label>
            <input
              type="text"
              id="user"
              placeholder="Enter Username"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div className="two">
            <div className="login-password-container">
              <label htmlFor="password" className="pass-bel">
                Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="log-pass"
                placeholder="Enter Password"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
                pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}"
              />
              <img
                id="login-img"
                src={passwordVisible ? "/open.png" : "/closed.png"}
                alt="Toggle Password"
                width="20"
                height="20"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="l-checkbox">
              <label htmlFor="remember-me">
                <input type="checkbox" id="remember-me" />
                Remember Me
              </label>
            </div>
          </div>

          {error && (
            <p className="error" style={{ color: "red" }}>
              * Email and password are required!
            </p>
          )}
        </form>
        <div className="button-container">
          <button id="login-submitButton" type="submit" onClick={handleSave}>
            Login
          </button>
          <a href="/forgot" className="forgot-password">
            Forgot your password?
          </a>
        </div>
        <p className="login-link">
          Don't have an account yet?{" "}
          <a href="/create" className="login-a">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}