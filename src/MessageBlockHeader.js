import React from "react";
import guestIcon from "./guest.png";
const MessageBlockHeader = ({ profilePictureURL, userColor, username }) => {
    return (
        <div className="messageBlockHeader">
            <div className="profilePictureContainer">
                <img
                    src={
                        profilePictureURL
                            ? profilePictureURL
                            : guestIcon
                    }
                    className="profilePicture"
                />
            </div>
            <div className="usernameData" style={{ color: userColor }}>
                {username}
            </div>
        </div>
    );
}
export default MessageBlockHeader;