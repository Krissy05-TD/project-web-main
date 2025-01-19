import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './style/welcome.css';

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

export default function Welcomes() {
    const [firstname, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('email'); // Retrieve email from localStorage
        if (storedEmail) {
            setEmail(storedEmail);
            fetchUserName(storedEmail); // Fetch firstname using the email
        }
    }, []);

    const fetchUserName = async (email) => {
        try {
            const docRef = doc(db, 'users', email); // Reference the document by email
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setFirstName(userData.firstname || 'Guest'); // Set firstname or fallback to 'Guest'
                console.log(`User exists: ${email}, Name: ${userData.firstname}`);
            } else {
                console.log(`User does not exist: ${email}`);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('email'); // Remove email from localStorage
        localStorage.removeItem('firstname'); // Remove firstname if stored
        window.location.href = '/login'; // Redirect to login page
    };

    const handlePortfolioClick = () => {
        window.open("https://kristenfolio.netlify.app/", '_blank', 'noopener noreferrer');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="welcome">
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
                        <li><a href="/edit" id='edit' onClick={toggleMenu}>Edit Profile</a></li>
                        <li><a href="https://kristenfolio.netlify.app/" id='about' onClick={toggleMenu}>About</a></li>
                        <li><a href="/contact" id='contact' onClick={toggleMenu}>Contact</a></li>
                        <button type="button" id="wel-mit" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>
            <br />
            <form className="all">
                <div className="form">
                    <h1 className='wel-h1'>Hello, {firstname}
                        <img
                            className='star'
                            src='/shining.png'
                            alt='star '
                        />!
                    </h1>
                    <p className="welcome">Welcome to my first Project.
                        <p>
                            Check out my portfolio to learn more about me. <br></br>
                            <button type='button' onClick={handlePortfolioClick} target="_blank" rel="noopener noreferrer">
                                My Portfolio
                            </button>
                        </p>
                    </p>
                </div>
            </form>
        </div>
    );
}
