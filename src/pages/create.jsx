import React, { useRef, useState, useEffect } from "react";
import { firestore } from "../firebase";
import { setDoc, doc } from "@firebase/firestore"; // Use setDoc to overwrite the document with email as ID
import axios from 'axios';
import "./style/create.css";

export default function Create() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const numberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const sendOtpNumberRef = useRef();
  const sendOtpEmailRef = useRef();
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");
  const [firstname, setFirstName] = useState("");
  const [otp, setOtp] = useState(""); // New state for OTP

  // States to manage visibility of passwords
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // useEffect to load stored name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setFirstName(storedName);
    } 
    fetch('http://localhost:5000/api/message')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error fetching data:', error));
            axios.get('http://localhost:5000/api/message')
            .then((response) => setMessage(response.data.message))
            .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const sendData = () => {
    fetch('http://localhost:5000/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'John Doe' }),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
};

  const handleCheckboxChange = (type) => {
    if (type === "number") {
      if (sendOtpNumberRef.current.checked) {
        sendOtpEmailRef.current.checked = false;
      }
    } else if (type === "email") {
      if (sendOtpEmailRef.current.checked) {
        sendOtpNumberRef.current.checked = false;
      }
    }
  };

  const handleSendOtp = async () => {
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    };
  
    const otp = generateOtp();
    setOtp(otp); // Set OTP in state to display on the page
    setStatus(`Generated OTP: ${otp}`);
  
    if (sendOtpNumberRef.current.checked || sendOtpEmailRef.current.checked) {
      const otpMethod = sendOtpNumberRef.current.checked ? "number" : "email";
      const destination = sendOtpNumberRef.current.checked
        ? number.replace(/\s/g, "")
        : emailRef.current.value;
  
      try {
        console.log(`Sending OTP to ${otpMethod}:`, destination);
  
        // Save OTP to Firestore
        await setDoc(doc(firestore, "otps", destination), {
          method: otpMethod,
          destination,
          otp,
          createdAt: new Date(),
        });
  
        // Save OTP in localStorage
        localStorage.setItem("generatedOtp", otp);
        setStatus(`OTP sent successfully via ${otpMethod}.`);
        
        console.log(`Generated OTP: ${otp}`);
  
        // Add a small delay before redirecting to OTP page
        setTimeout(() => {
          window.location.href = "/otp"; // Redirect after showing OTP
        }, 2000); // 2-second delay for the user to see the OTP
      } catch (error) {
        console.error("Error sending OTP:", error.message);
        setStatus(`Failed to send OTP via ${otpMethod}`);
      }
    } else {
      setStatus("Please select a method to send the OTP.");
    }
  };
  

  const handleNumberChange = (e) => {
    let input = e.target.value;
    input = input.replace(/\D/g, "");

    // Add spaces automatically as user types
    if (input.length > 3 && input.length <= 6) {
      input = input.slice(0, 3) + " " + input.slice(3);
    } else if (input.length > 6) {
      input = input.slice(0, 3) + " " + input.slice(3, 6) + " " + input.slice(6, 10);
    }

    setNumber(input);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Sanitize and retrieve input values
    const sanitizedNumber = number.replace(/\s/g, ""); // Remove spaces from the phone number
    const password = passwordRef.current.value;
    const confirmPassword = document.getElementById("c-confirm-password").value;

    // Determine OTP method
    const otpMethod = sendOtpNumberRef.current.checked
      ? "number"
      : sendOtpEmailRef.current.checked
      ? "email"
      : "none";

    const data = {
      firstname: firstnameRef.current.value.trim(),
      lastname: lastnameRef.current.value.trim(),
      number: sanitizedNumber,
      email: emailRef.current.value.trim(),
      password,
      otpMethod,
    };

    // Validations
    if (!data.firstname || !data.lastname || !data.number || !data.email || !data.password) {
      alert("All fields are required.");
      return;
    }

    if (!/^\d{10}$/.test(data.number)) {
      alert("Invalid phone number format. Please enter a valid 10-digit number.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert("Invalid email format. Please enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

    if (!otpMethod || otpMethod === "none") {
      alert("Please select a method to send the OTP.");
      return;
    }

    try {
      // Save data to Firestore
      await setDoc(doc(firestore, "users", data.email), data);
      console.log("Data saved to Firestore:", data);

      // Save data to localStorage
      localStorage.setItem("userName", data.firstname);
      localStorage.setItem("firstname", data.firstname);
      localStorage.setItem("lastname", data.lastname);
      localStorage.setItem("number", data.number);
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);

      // Send OTP
      await handleSendOtp();

    } catch (error) {
      console.error("Error saving data to Firestore:", error.message);
      alert("An error occurred while saving data. Please try again.");
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
    <div>
      <div className="create">
        <div className="create-left">
          <h1>
            <img src="/logo.jpeg" alt="Four Leaf Clover" />
            Project 1
          </h1>
        </div>
        <div className="create-right">
          <form className="create-form-grid" onSubmit={handleSave}>
            <div>
              <label className="firstname">
                First Name
                <input
                  type="text"
                  placeholder="Enter First Name"
                  ref={firstnameRef}
                  value={firstname}
                  id="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label className="lastname">
                Last Name
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  ref={lastnameRef}
                  id="lastname"
                  required
                />
              </label>
            </div>

            <div>
              <label htmlFor="number">
                Cellphone Number
                <input
                  type="tel"
                  placeholder="012 345 6789"
                  ref={numberRef}
                  id="number"
                  value={number}
                  onChange={handleNumberChange}
                  required
                />
              </label>
              <div className="c-checkbox">
                <input
                  type="checkbox"
                  name="otp_method[]"
                  value="number"
                  id="send-otp-num"
                  ref={sendOtpNumberRef}
                  onChange={() => handleCheckboxChange("number")}
                />
                <label htmlFor="send-otp-num">Send OTP via number</label>
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                name="email"
                id="email"
                ref={emailRef}
                required
              />
              <div className="c-checkbox">
                <input
                  type="checkbox"
                  name="otp_method[]"
                  value="email"
                  id="send-otp-mail"
                  ref={sendOtpEmailRef}
                  onChange={() => handleCheckboxChange("email")}
                />
                <label htmlFor="send-otp-mail">Send OTP via mail</label>
              </div>
            </div>

            <div className="create-password-container">
              <label className="c-password">
                Password
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  ref={passwordRef}
                  autoComplete="off"
                  id="c-password"
                  required
                />
                <img
                  id="create-img"
                  src={passwordVisible ? "/open.png" : "/closed.png"}
                  alt="Show Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("password")}
                />
              </label>
            </div>
            <div className="create-password-container">
              <label className="c-confirm-password">
                Confirm Password
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  id="c-confirm-password"
                  required
                />
                <img
                  id="create-c-img"
                  src={confirmPasswordVisible ? "/open.png" : "/closed.png"}
                  alt="Show Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                />
              </label>
            </div>

            <div className="create-with-container">
              <p className="create-icons">Or you can login with</p>
              <div className="icon-container">
                <img
                  className="gmail-icon"
                  src="/gmail.png"
                  alt="Gmail"
                  onClick={() => (window.location.href = "https://gmail.com/")}
                />
                <img
                  className="facebook-icon"
                  src="/facebook.png"
                  alt="Facebook"
                  onClick={() => (window.location.href = "https://facebook.com/")}
                />
                <img
                  className="apple-icon"
                  src="/apple.png"
                  alt="Apple"
                  onClick={() => (window.location.href = "https://appleid.apple.com/")}
                />
              </div>
            </div>
            <p className="message">{message}</p>
          </form>
          <button type="button" id="cre-button" onClick={handleSendOtp, handleSave}>
            Send Verification Code
          </button>
          <div style={{ marginTop: status ? "0px" : "0", marginLeft: status ? "30px" : "0", color: "rgb(236, 107, 129)" }}>
            {status && <p>{status}</p>}
          </div>
          <p className="create-p">
            Already have an account?
            <a href="/login" className="create-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}