import React from "react";
import settingsIcon from "./settings.png";
import logoutIcon from "./logout.png";
import { useEffect, useState } from "react";

const SettingsBar = ({ setShowModalWindow, setModalWindowState, isConnected, showModalWindow }) => {


    const handleLogoutClick = () => {
        setModalWindowState("logout")
        setShowModalWindow(true);

    }
    const handleSettingsClick = () => {
        setModalWindowState("settings")
        setShowModalWindow(true);

    }
    return (
        <div className="settingsBarContainer">
            <div className="settingsBarIconContainer" >
                <img src={settingsIcon} alt="Settings" title="Settings" onClick={handleSettingsClick} />
            </div>
            <div className="settingsBarIconContainer" >
                <img src={logoutIcon} alt="Logout" title="Logout" onClick={handleLogoutClick} />
            </div>
            <div className="connectionStatusMessage">

                Status: {isConnected ? "Connected" : "Disconnected"} <br />
                <button disabled={isConnected}>Retry Connection</button>

            </div>
        </div>
    );
}

export default SettingsBar;