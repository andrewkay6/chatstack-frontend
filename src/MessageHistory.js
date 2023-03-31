import React, { useState } from 'react';
import guestIcon from './guest.png';
import MessageBlockData from './MessageBlockData';
import MessageBlockHeader from './MessageBlockHeader';

const MessageHistory = ({ messageHistory }) => {
  const [showDateTime, setShowDateTime] = useState(true);


  let messageHistoryContents = (<></>);

  messageHistoryContents = (
    <div className="messageHistoryTableContainer">
      <div className="messageHistoryTable">
        {messageHistory.map((messageBlock, blockIndex) => (
          <div className="messageBlockContainer" key={`block-${blockIndex}`}>
            <MessageBlockHeader
              profilePictureURL={messageBlock.profilePictureURL}
              userColor={messageBlock.userColor}
              username={messageBlock.username}
            />
            <MessageBlockData
              messageContent={messageBlock.messageContent}
            />
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