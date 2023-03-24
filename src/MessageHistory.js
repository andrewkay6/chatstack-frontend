import React, { useState } from 'react';

const MessageHistory = ({ messageHistory }) => {
  const [showDateTime, setShowDateTime] = useState(true);

  
  
  let messageHistoryContents = (<></>);

  

  
  messageHistoryContents = (
    <div className="messageHistoryTableContainer">
      <div className="messageHistoryTable">
        {messageHistory.map((messageObject, index) => (
          <React.Fragment key={messageObject['messageID']}>
            <div className="messageContainer">
              <div className="messageHeader">
                <div className="usernameData" >{messageObject['username']}</div>
                <div className='dateTimeData' >{messageObject['dateTime']}</div>
              </div>
              <div className="messageData">
                <td >{messageObject['message']}</td>
              </div>
            </div>
          </React.Fragment>
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