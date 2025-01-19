import React, { useState, useRef } from 'react';
import './style/newotp.css';

export default function NewOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Retrieve OTP from localStorage
  const storedOtp = localStorage.getItem('generatedOtp');

  // Function to handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  // Function to handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const enteredOtp = otp.join("");
    if (enteredOtp === storedOtp) {
      // OTP is correct, proceed to the next page
      setTimeout(() => {
        setLoading(false);
        alert("OTP verified successfully!");
        window.location.href = "/new"; // Navigate to the welcome page after verification
      }, 2000); // Spinner shows for 2 seconds
    } else {
      setTimeout(() => {
      // OTP is incorrect, show an error message
      setLoading(false);
      alert("Incorrect OTP. Please try again.");
    }, 2000);
    }
  };

  const handleResend = () => {
    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("New OTP:", newOtp); // Log the new OTP to the console

    // Save the new OTP in localStorage
    localStorage.setItem("generatedOtp", newOtp);

    // Reset OTP input fields
    setOtp(new Array(6).fill(""));
    inputs.current[0].focus();

    alert("A new OTP has been sent. Check the console for the OTP.");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="otp">
      <div className="verification-container-n">
        <div>
          <img
            className="back"
            src="/back.png"
            alt="back"
            onClick={() => window.location.href = '/forgot'}
          />
        </div>
        <h1 className="ot-h1">User Verification</h1>
        <div className="otp-container">
          <form id="otp-form-n" onSubmit={handleSubmit}>
            <div className="otp-field">
              <div className="otp-input-group">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    className="otp-input-n"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputs.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              id="otp-button"
              disabled={!isOtpComplete}
            >
              Verify
            </button>
          </form>
        </div>
        <p className="o">Did not receive the code?</p>
        <a href="/newotp" onClick={handleResend} className='a-n'>Resend</a>
      </div>

      {loading && (
        <div className="loading-container-n" id="loading-container">
          <div className="spinner-n"></div>
          <p>Verifying OTP... Please wait.</p>
        </div>
      )}
    </div>
  );
}
