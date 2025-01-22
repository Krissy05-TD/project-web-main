import React, { useRef, useState } from "react";
import "./style/new.css";

export default function New() {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    digits: false,
    uppercase: false,
    specialChar: false,
  });

  // Function to validate the password
  const isPasswordValid = (password) => {
    const validLength = password.length >= 8;
    const validDigits = /\d/.test(password);
    const validUppercase = /[A-Z]/.test(password);
    const validSpecialChar = /[~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
      password
    );

    // Return validation result
    return {
      length: validLength,
      digits: validDigits,
      uppercase: validUppercase,
      specialChar: validSpecialChar,
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    if (!password || !confirmPassword) {
      setError("* Both password fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("* Passwords do not match!");
      return;
    }

    // Update password validation status
    const passwordValidation = isPasswordValid(password);
    setPasswordValid(passwordValidation);

    const data = { password };

    setLoading(true);
    try {
      await (data);
      window.location.href = "/loginN"; // Redirect after successful save
    } catch (e) {
      console.error(e);
      setError("An error occurred while saving the password!");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible((prev) => !prev);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible((prev) => !prev);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="new">
        <div className="new-left">
          <div>
            <h1>
              <img src="logo.jpeg" alt="Four Leaf Clover" />
              Project 1
            </h1>
          </div>
        </div>

        <div className="new-right">
          <form className="n-signup-form" onSubmit={handleSave}>
            <h1>Create a New Password</h1>
            <div className="new-password-container">
              <div className="new-password">
                <label htmlFor="password" className="new-label">
                  New Password
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="n-password"
                  placeholder="Enter a New Password"
                  ref={passwordRef}
                  onChange={(e) => {
                    const validation = isPasswordValid(e.target.value);
                    setPasswordValid(validation); // Update password validity on each change
                  }}
                />
                <img
                  id="new-t-check"
                  src={passwordVisible ? "open.png" : "closed.png"}
                  alt="Toggle Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("password")}
                />
              </div>

              <div className="confirm-password">
                <label htmlFor="confirm-password" className="new-label">
                  Confirm Password
                </label>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="n-confirm"
                  placeholder="Confirm New Password"
                  ref={confirmPasswordRef}
                />
                <img
                  id="new-check"
                  src={confirmPasswordVisible ? "open.png" : "closed.png"}
                  alt="Toggle Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                />
              </div>
            </div>

            <div className="new-requirements">
              <p>Password must contain:</p>
              <ul id="new-requirements-list">
                <div className={passwordValid.length ? "valid" : "invalid"}>
                  At least 8 characters
                </div>
                <div className={passwordValid.digits ? "valid" : "invalid"}>
                  At least 1 number
                </div>
                <div className={passwordValid.uppercase ? "valid" : "invalid"}>
                  Uppercase and Lowercase letters
                </div>
                <div
                  className={passwordValid.specialChar ? "valid" : "invalid"}
                >
                  Special characters (~`!@#$%^&amp;*()-_+={}
                  []|\\;:&quot;&lt;&gt;,./?)
                </div>
              </ul>
            </div>

            {error && (
              <p className="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
          </form>
          <button type="submit" id="new-submit-btn" onClick={handleSave}>
            Submit
          </button>

          <p className="new-link">
          Remembered your password?{" "}
          <a href="/login" className="new-p-a">Login</a>
          </p>

          {loading && (
            <div className="new-loading-container">
              <div className="spinner"></div>
              <p>Verifying OTP... Please wait.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
