import React from "react";
import settingsIcon from "./settings.png";
import logoutIcon from "./logout.png";

const SettingsBar = () => {

    return (
        <div className="settingsBarContainer">
            <div className="settingsBarIconContainer" >
                <img src={settingsIcon} alt="Settings" title="Settings"/>
            </div>
            <div className="settingsBarIconContainer" >
                <img src={logoutIcon} alt="Logout" title="Logout"/>
            </div>
        </div>
    );
}

export default SettingsBar;