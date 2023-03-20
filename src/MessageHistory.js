import React from 'react';

const MessageHistory = ({ messageHistory }) => {
  return (
    <div>
      <table>
        <tbody>         
          {messageHistory.map((messageObject, index) => (
            <tr key={index}>
              <td>{messageObject}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageHistory;