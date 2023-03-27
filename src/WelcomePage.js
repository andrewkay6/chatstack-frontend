import React, { useState } from "react";
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
            <div className="welcomePageTitle">Welcome To ChatStack</div>

            <LoginScreen appState={props.appState} setAppState={props.setAppState} />

            <div className="newUserContainer">
                <div className="welcomePageHeader">New To ChatStack?</div>
                <button id="signUp" onClick={handleSignUpPress}>Sign Up!</button>
            </div>
        </>
    );
}

export default WelcomePage;