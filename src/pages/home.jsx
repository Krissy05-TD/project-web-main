import React, { useRef } from "react";
import { firestore } from "../firebase";
import { addDoc,collection } from '@firebase/firestore';
import './style/home.css';

export default function Home() {
    const ref = collection(firestore, "messages");

    const homeRef = useRef();

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(homeRef.current.value);

        const data = {
            home: homeRef.current.value,
        }

        try {
            addDoc(ref,data);
        }catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="account">
            
            <form className='h-form-grid' onSubmit={handleSave}>
            <div className="heading-h1">
            <h1>
                <img src="/logo.jpeg" alt="Four Leaf Clover" className="heading-img"/>
                Project 1
            </h1>
            </div>
            <h1 className="begin" ref={homeRef}>Welcome</h1>
            <p className="start-p"><em>Please select whether you would want to sign up or log in.</em></p>
            <div className="button-s">
            
            <div>
            <button type="button" onClick={() => window.location.href="create"} id="h-button">Sign In</button>
            </div>
            <div>
            <button type="button" onClick={() => window.location.href="login"} id="h-button">Log In</button>
            </div>

            </div>
            </form>
        </div>
    )
}
