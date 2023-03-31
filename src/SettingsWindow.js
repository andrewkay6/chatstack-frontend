import React, { useState, useEffect } from "react";
import validUrl from 'valid-url';
import guestIcon from './guest.png';
const SettingsWindow = () => {


    const [isValidUrl, setIsValidUrl] = useState(true);
    const [imageURL, setImageURL] = useState("https://media.tenor.com/JewZ29ammecAAAAM/purple-and-brown-chewing-gum.gif");
    const [reconnectMessage, setReconnectMessage] = useState(<></>)


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
            Profile Picture URL:
            <input
                type="url"
                onChange={handleURLUpdate}
                placeholder="Blank URLs will use the default avatar"
                defaultValue={imageURL}
            />
            <button>Submit URL</button>
            <br />
            Image Preview: <br />
            <div className='profilePictureContainer'>
                <img src={imageURL ? imageURL : guestIcon}
                    className="profilePicture"
                />

            </div>
            <div>Image not cropped as expected? Upload a square image to an image hosting platform:</div>

            <div>Set user color:</div>
        </div>
    );
}

export default SettingsWindow;