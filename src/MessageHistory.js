import React from 'react';

const MessageHistory = ({ messageHistory }) => {
  return (
    <div>
      <table>
        <tbody>
          {messageHistory.map((messageObject, index) => (
            <tr key={index}>
              <td>{messageObject.username}: </td>
              <td>{messageObject.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageHistory;