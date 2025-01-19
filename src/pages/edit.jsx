import React, { useState, useRef } from "react";
import { firestore } from "../firebase";
import { collection } from "@firebase/firestore"
import "./style/edit.css"

export default function Edit() {
    const ref = collection(firestore, "users"); 

    const [username] = useState("");
    const usernameRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const numberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [number, setNumber] = useState("");
    const [status, setStatus] = useState("");
    const [firstname, setFirstName] = useState("");

    // States to manage visibility of passwords
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('email'); // Remove email from localStorage
        localStorage.removeItem('firstname'); // Remove firstname if stored
        window.location.href = '/login'; // Redirect to login page
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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

        const data = {
            firstname: firstnameRef.current.value.trim(),
            lastname: lastnameRef.current.value.trim(),
            number: sanitizedNumber,
            email: emailRef.current.value.trim(),
            password,
        };

        if (!data.firstname || !data.lastname || !data.number || !data.email || !data.password) {
            alert("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please check and try again.");
            return;
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
        <div id="edit-page">
            <form className="edit-page">

                <nav id="hamburger-nav">
                    <div className="hamburger-menu">
                        <div
                            className={`hamburger-icon ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={`menu-links ${isMenuOpen ? 'active' : ''}`}>
                            <li><a href="/welcome" id='welcome' onClick={toggleMenu}>Home</a></li>
                            <li><a href="/edit" id='edit' onClick={toggleMenu}>Edit Profile</a></li>
                            <li><a href="https://kristenfolio.netlify.app/" id='about' onClick={toggleMenu}>About</a></li>
                            <li><a href="/contact" id='contact' onClick={toggleMenu}>Contact</a></li>
                            <button type="button" id="wel-mit" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </nav>
                <div className="edit">
                    <h1>Edit Profile</h1>
                </div>

                <form className="change-form-grid" onSubmit={handleSave}>
                    <div id="form-change">
                        <div id="label">
                            <p>User Details</p>
                            <div>
                                <input
                                    type="text"
                                    id="change"
                                    placeholder="New Username"
                                    ref={usernameRef}
                                    value={username}
                                    required />
                                <button type="submit" id="user-btn">
                                    Change Username
                                </button>
                            </div>

                            <div className="change-container">
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    ref={firstnameRef}
                                    value={firstname}
                                    id="change-f"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                <button type="submit" id="user-btn">
                                    Change Firstname
                                </button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    ref={lastnameRef}
                                    id="change"
                                    required
                                /><button type="submit" id="user-btn">
                                    Change Lastname
                                </button>
                            </div>
                        </div>
                        <div id="label">
                            <p>Contact Details</p>
                            <div className="change-container">
                                <input
                                    type="tel"
                                    placeholder="012 345 6789"
                                    ref={numberRef}
                                    id="change-n"
                                    value={number}
                                    onChange={handleNumberChange}
                                    required
                                /><button type="submit" id="user-btn">
                                    Change Number
                                </button>
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    name="email"
                                    id="change"
                                    ref={emailRef}
                                    required
                                /><button type="submit" id="user-btn">
                                    Change Email
                                </button>
                            </div>
                        </div>
                        <div id="label">
                            <p>Password</p>
                            <div className="change-password-container">

                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    ref={passwordRef}
                                    autoComplete="off"
                                    id="change"
                                    required
                                />
                                <img
                                    id="change-img"
                                    src={passwordVisible ? "/open.png" : "/closed.png"}
                                    alt="Show Password"
                                    width="20px"
                                    height="20px"
                                    onClick={() => togglePasswordVisibility("password")}
                                /><button type="submit" id="user-btn">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <button type="submit" id="save">Save Changes</button>

            </form>
        </div>
    )
}