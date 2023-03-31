import React from "react";

const MessageBlockData = ({ messageContent }) => {
    return (
        <div className="messageBlockData">
            {messageContent.map((messageObject, messageIndex) => (
                <div className="messageContainer" key={`message-${messageIndex}`}>
                    <div className="messageData">{messageObject.message}</div>
                    <div className="messageDateTime">{messageObject.dateTime}</div>
                </div>
            ))}
        </div>
    );
};
export default MessageBlockData;