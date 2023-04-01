import React from "react";

const LogoutWindow = ({handleDisconnect, setAppState, visible}) => {
    const logoutUser = () => {
        handleDisconnect();
        setAppState("welcomePage");
    }   
    return (

        <div className="logoutWindow">
            <div className="logoutConfirmationMessage">
                Are you sure you want to log out?
            </div>
            
            <button className="logoutButton" onClick={logoutUser}> Yes, log me out.</button>
        </div>
        

    );
}

export default LogoutWindow;