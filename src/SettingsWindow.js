import React, { useState } from "react";
import validUrl from 'valid-url';
const SettingsWindow = () => {
   

    const [isValidUrl, setIsValidUrl] = useState(true);
    const [imageURL, setImageURL] = useState("");

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
            Settings <br/>
            Profile Picture URL: 
            <input
                type="url"
                onChange={handleURLUpdate}
                placeholder="Blank URLs will use the default avatar"
            />
            <button>Submit URL</button>
            <br/>
            Image Preview:
            <img src={imageURL}/>
            <img src={imageURL}/>
        </div>
    );
}

export default SettingsWindow;