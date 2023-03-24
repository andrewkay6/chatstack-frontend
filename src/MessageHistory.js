import React, { useState } from 'react';

const MessageHistory = ({ messageHistory }) => {
  const [showDateTime, setShowDateTime] = useState(true);

  
  let messageHistoryContents = (<></>);
  
  messageHistoryContents = (
    <div className="messageHistoryTableContainer">
      <div className="messageHistoryTable">
        {messageHistory.map((messageBlock, blockIndex) => (
          <div className="messageBlockContainer" key={`block-${blockIndex}`}>
            <div className="messageBlockHeader">
              <div className="usernameData">{messageBlock.username}</div>
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