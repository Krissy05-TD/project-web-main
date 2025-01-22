import React, { useState } from 'react';
import { firestore } from '../firebase'; // Ensure you have Firebase set up
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getDoc, collection } from '@firebase/firestore';
import './style/forgot.css'; // Assuming you have the CSS file for styling

const firebaseConfig = {
  apiKey: "AIzaSyBEy6Sh4rk9WiJHyueMVYhnRmGUeCsDQQs",
  authDomain: "signin-88f3a.firebaseapp.com",
  projectId: "signin-88f3a",
  storageBucket: "signin-88f3a.firebasestorage.app",
  messagingSenderId: "105171186737",
  appId: "1:105171186737:web:cb685e4b96161941b51110"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Forgot() {
  const [ setFirstName] = useState('');
  const [otpMethod, setOtpMethod] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword] = useState('');

  const ref = collection(firestore, 'login'); // Reference to 'users' collection in Firestore

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem('email'); // Retrieve email from localStorage
  //   if (storedEmail) {
  //       setEmail(storedEmail);
  //       fetchUserName(storedEmail); // Fetch firstname using the email
  //   }    
  //   const storedNumber = localStorage.getItem('number'); // Retrieve email from localStorage
  //   if (storedNumber) {
  //       setNumber(storedNumber);
  //   }
  // }, []);

  const fetchUserName = async (identifier) => {
    try {
      const isEmail = identifier.includes('@'); // Basic check for email format
      let docRef;

      if (isEmail) {
        docRef = doc(db, 'users', identifier); // If email, query by email
      }

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFirstName(userData.firstname || 'Guest'); // Set firstname or fallback to 'Guest'
        localStorage.setItem('firstname', userData.firstname || 'Guest'); // Store firstname
        console.log(`User exists: ${identifier}, Name: ${userData.firstname}`);
      } else {
        console.log(`User does not exist: ${identifier}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleOtpMethodChange = (e) => {
    setOtpMethod(e.target.value);
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

  const generateAndSendOTP = async (otp, method) => {
    try {
      // Save OTP in localStorage
      localStorage.setItem('generatedOtp', otp);
      localStorage.setItem('otpMethod', method);
  
      // Simulate sending OTP (you can integrate actual OTP sending logic here)
      alert('OTP sent successfully!');
      window.location.href = '/newotp'; // Redirect to OTP verification page
    } catch (error) {
      console.error('Error generating OTP:', error);
      setErrorMessage('Error generating OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!otpMethod) return setErrorMessage('Please select an OTP method.');
  
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    console.log('Generated OTP:', otp); // Log OTP before passing to the function
  
    let firstname = ''; // Placeholder for the user's firstname
    if (otpMethod === 'number' && number) {
      firstname = number; // Use the phone number as the firstname temporarily
      localStorage.setItem('userId', number); // Save phone number
      localStorage.setItem('firstname', firstname); // Save firstname
      await generateAndSendOTP(otp, 'number');
    } else if (otpMethod === 'email' && email) {
      firstname = email; // Use the email as the firstname temporarily
      localStorage.setItem('userId', email); // Save email
      localStorage.setItem('firstname', firstname); // Save firstname
      await generateAndSendOTP(otp, 'email');
    }
    else {
      setErrorMessage('Please fill in the required fields.');
    }
  
    if (firstname) {
      console.log(`User verified: ${firstname}`); // Log firstname as verification
    }
  };  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId || !newPassword) return setErrorMessage('Please provide a new password.');

    try {
      // Update the password in the "passwords" collection
      const passwordRef = doc(db, 'passwords', userId);
      await updateDoc(passwordRef, { password: newPassword });

      alert('Password updated successfully!');
      window.location.href = '/login'; // Redirect to login page after password change
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Error updating password.');
    }
  };

  return (
    <div>
      <div className="forgot">
        <form className="forgot-back" onSubmit={handleSubmit}>
          <div className="back-img">
            <img
              src="/back.png"
              alt="back arrow icon"
              className="icon arrow"
              style={{ width: '20px', height: '20px' }}
              onClick={() => window.location.href = '/login'} // Redirect to previous page
            />
          </div>
          <div className='opt'>
            <label>Send OTP via:</label>
            <select
              name="otp"
              id="forgot-otp"
              value={otpMethod}
              onChange={handleOtpMethodChange}
              required
            >
              <option value="">Select an Option</option>
              <option value="number">Phone Number</option>
              <option value="email">Email</option>
            </select>
          </div>

          {otpMethod === 'number' && (
            <div id="phone-input">
              <label className='num'>Enter Phone Number:</label>
              <input
                type="tel"
                name="number"
                id="forgot-number"
                placeholder="012 345 6789"
                value={number}
                onChange={handleNumberChange}
                required
              />
            </div>
          )}

          {otpMethod === 'email' && (
            <div id="email-input">
              <label className='em'>Enter Email:</label>
              <input
                type="email"
                name="email"
                id="forgot-email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" id="for-submit">Send OTP</button>

          {/* Error Message Display */}
          {errorMessage && <p className="error" style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
