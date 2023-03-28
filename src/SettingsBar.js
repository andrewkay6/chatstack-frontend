import React from "react";
import settingsIcon from "./settings.png";
import logoutIcon from "./logout.png";

const SettingsBar = () => {

    const handleLogoutClick = () => {
        console.log('logout');
    }
    const handleSettingsClick = () => {
        console.log('settings');
    }
    return (
        <div className="settingsBarContainer">
            <div className="settingsBarIconContainer" >
                <img src={settingsIcon} alt="Settings" title="Settings" onClick={handleSettingsClick}/>
            </div>
            <div className="settingsBarIconContainer" >
                <img src={logoutIcon} alt="Logout" title="Logout" onClick={handleLogoutClick}/>
            </div>
        </div>
    );
}

export default SettingsBar;