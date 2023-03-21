import React, {useState} from 'react';

const MessageHistory = ({ messageHistory }) => {
  
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Message ID</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>User ID</th>  
          </tr>         
          {messageHistory.map((messageObject, index) => (
            <tr key={index}>
              <td>{messageObject['messageID']}</td>
              <td>{messageObject['message']}</td>
              <td>{messageObject['dateTime']}</td>
              <td>{messageObject['userID']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageHistory;