import React, { useState } from 'react';
import guestIcon from './guest.png';

const MessageHistory = ({ messageHistory }) => {
  const [showDateTime, setShowDateTime] = useState(true);


  let messageHistoryContents = (<></>);

  messageHistoryContents = (
    <div className="messageHistoryTableContainer">
      <div className="messageHistoryTable">
        {messageHistory.map((messageBlock, blockIndex) => (
          <div className="messageBlockContainer" key={`block-${blockIndex}`}>
            <div className="messageBlockHeader">
              <div className='profilePictureContainer'>
                <img src={messageBlock.profilePictureURL ? messageBlock.profilePictureURL : guestIcon}
                  className="profilePicture"
                />
              </div>
              <div className="usernameData" style={{ color: messageBlock.userColor }}>{messageBlock.username}</div>

            </div>
            <div className="messageBlockData">
              {messageBlock.messageContent.map((messageObject, messageIndex) => (
                <div className="messageContainer" key={`message-${blockIndex}-${messageIndex}`}>
                  <div className="messageData">
                    {messageObject.message}
                  </div>
                  <div className="messageDateTime">
                    {messageObject.dateTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='messageHistory'>
      {messageHistoryContents}
    </div>
  );
};

export default MessageHistory;