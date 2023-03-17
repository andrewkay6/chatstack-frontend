import React, { useState} from "react";
import './WelcomePage.css';
import LoginScreen from "./LoginScreen";
const WelcomePage = (props) => {

    const handleUserLoginPress = () => {
        props.setAppState("userLogin")

    }
    const handleGuestLoginPress = () => {

    }
    const handleSignUpPress = () => {
        props.setAppState("signUp")
    }

    

    return (
        <>
        <div className="title">Welcome To ChatStack</div>
        
        <LoginScreen appState={props.appState} setAppState={props.setAppState}/>
        
        <button id="guestLogin">Continue As Guest</button>

        <div className="header">New To ChatStack?</div>
        <button id="signUp" onClick={handleSignUpPress}>Sign Up!</button>
        </>
    );
}

export default WelcomePage;