import React, { useState, useEffect } from "react";
import { BlockPicker } from 'react-color'
import validUrl from 'valid-url';
import guestIcon from './guest.png';
import MessageBlockHeader from "./MessageBlockHeader";
const SettingsWindow = ({ userInfo }) => {


    const [isValidUrl, setIsValidUrl] = useState(true);
    const [imageURL, setImageURL] = useState(userInfo['profilePictureURL']);
    const [reconnectMessage, setReconnectMessage] = useState(<></>)
    const [color, setColor] = useState({});

    const checkURL = (event) => {

        if (validUrl.isUri(event.target.value)) {
            console.log(event.target.value)
            setIsValidUrl(true);
        }
        else {
            setIsValidUrl(false);
        }
    }
    const handleURLUpdate = (event) => {
        checkURL(event)
        setImageURL(event.target.value);
    }

    return (
        <div className="settingsWindow">
            <div className="settingsWindowTitle">
                Settings
            </div> <br />
            <MessageBlockHeader
                profilePictureURL={imageURL}
                userColor={color}
                username={userInfo['username']}
            />
            Profile Picture URL:
            <input
                type="url"
                onChange={handleURLUpdate}
                placeholder="Blank URLs will use the default avatar"
                defaultValue={userInfo['profilePictureURL']}
            />
            <button>Submit URL</button>
            <br />
            Image Preview: <br />
            
            <div>Image not cropped as expected? Upload a square image to an image hosting platform:</div>

            <div>Set user color:</div>  
        </div>
    );
}

export default SettingsWindow;