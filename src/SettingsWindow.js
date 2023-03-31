import React, { useState, useEffect, useRef } from "react";
import { BlockPicker } from 'react-color'
import validUrl from 'valid-url';
import guestIcon from './guest.png';
import MessageBlockHeader from "./MessageBlockHeader";
import { updateUserInfo, fetchUserInfo } from "./ChatAPICalls";

const SettingsWindow = ({ userInfo, setUserInfo }) => {


    const [isValidUrl, setIsValidUrl] = useState(true);
    const [imageURL, setImageURL] = useState(userInfo['profilePictureURL']);
    const [reconnectMessage, setReconnectMessage] = useState(<></>)
    const [color, setColor] = useState(userInfo['userColor']);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const colorPickerRef = useRef(null);
    const handleBlockPickerChange = (newColor) => {
        setColor(newColor['hex']);
        console.log(newColor);
    }

    let colorPicker = (<></>);
    if (showColorPicker) {
        colorPicker = (
            <div className="colorPickerContainer" ref={colorPickerRef}>
                <BlockPicker
                    className="colorPicker"
                    color={color}
                    disableAlpha={true}
                    triangle="hide"
                    styles={{ default: { card: { background: 'rgb(55, 55, 55)' } } }}
                    onChange={handleBlockPickerChange}
                />
            </div>
        );
    }
    else {
        colorPicker = (<></>);
    }
    const handleClose = () => {
        setShowColorPicker(false);
    }
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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target) &&
                showColorPicker
            ) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [colorPickerRef, handleClose, showColorPicker]);

    const handleSubmitClick = async () => {
        let newUserInfo = JSON.parse(JSON.stringify(userInfo));
        newUserInfo['profilePictureURL'] = imageURL;
        newUserInfo['userColor'] = color;
        await updateUserInfo(newUserInfo);

        const newUserInfoFromServer = await fetchUserInfo();

        setUserInfo(newUserInfoFromServer);

    }


    return (
        <div className="settingsWindow">
            <div className="settingsWindowTitle">
                Settings
            </div>
            <div className="settingsWindowSubtitle">Chat Preview:</div>

            <MessageBlockHeader
                profilePictureURL={imageURL}
                userColor={color}
                username={userInfo['username']}
                userNameOnClick={() => { setShowColorPicker(!showColorPicker) }}
            />
            {colorPicker}
            Profile Picture URL: <br />
            <input
                type="url"
                onChange={handleURLUpdate}
                placeholder="Blank URLs will use the default avatar"
                defaultValue={userInfo['profilePictureURL']}
            />
            <button onClick={handleSubmitClick}>Submit Changes</button>
        </div>
    );
}

export default SettingsWindow;