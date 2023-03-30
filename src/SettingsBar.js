import React from "react";
import settingsIcon from "./settings.png";
import logoutIcon from "./logout.png";
import infoIcon from "./info.png"
import { useEffect, useState } from "react";

const SettingsBar = ({ setShowModalWindow, setModalWindowState, isConnected, showModalWindow, reconnect }) => {

    const [connectedMessage, setConnectedMessage] = useState(<></>);
    const handleLogoutClick = () => {
        setModalWindowState("logout")
        setShowModalWindow(true);

    }
    const handleSettingsClick = () => {
        setModalWindowState("settings")
        setShowModalWindow(true);
    }
    const handleDisconnectClick = () => {
        reconnect();
    }
    useEffect(() => {
        if (isConnected){
            setConnectedMessage (
                <div style={{color: "green"}}>Connected as: abc</div>
            );
        }
        else {
            setConnectedMessage (
                <div className="disconnectMessage" onClick={handleDisconnectClick}>Disconnected</div>
            );
        }
    }, [isConnected])
    return (
        <div className="settingsBarContainer">
            <div className="settingsBarIconContainer" >
                <img src={settingsIcon} alt="Settings" title="Settings" onClick={handleSettingsClick} />
            </div>
            <div className="settingsBarIconContainer" >
                <img src={logoutIcon} alt="Logout" title="Logout" onClick={handleLogoutClick} />
            </div>
            <div className="settingsBarIconContainer" >
                <img src={infoIcon} alt="Info" title="Info" onClick={handleLogoutClick} />
            </div>
            <div className="settingsBarItemContainer">
                {connectedMessage}
            </div>


        </div>
    );
}

export default SettingsBar;