import React, { useEffect, useState } from 'react';
import MessageHistory from './MessageHistory';
import UserInput from './UserInput';
import io, { Socket } from 'socket.io-client';


const numberOfMessagesToPreload = "50";
const databaseTimezone = "GMT";

const ChatWindow = (props) => {
  //This state variable controls the message history that the window will actually display. 
  //It groups messages from messageList by username.
  const [messageHistory, setMessageHistory] = useState([]);
  //This state variable contains the actual message history as a list of objects.
  const [messageList, setMessageList] = useState([]);
  //This is the message that the user is currently typing.
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [socket, setSocket] = useState(null);
  //Declare socket here so it's in scope for the entire component, but it is initialized in useEffect

  let disconnectMessage = (<></>);


  const getMessageHistory = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ numberOfMessages: numberOfMessagesToPreload, startFromID: "" }),
    }

    const response = await fetch('http://localhost:5000/api/fetch-newest-messages', requestOptions);
    const data = await response.json();
    const messages = messageHistoryToObjectList(data['messages']).reverse();

    setMessageList(messages);
    console.log(formatMessageHistory(messageList))
    setMessageHistory(formatMessageHistory(messages));
  }
  const sendMessage = () => {
    socket.emit("send_message", JSON.stringify({ message: message }));
    setMessage("");
  }

  const formatMessageHistory = (messageHistoryList) => {
    let formattedMessageHistory = [];
    let currentMessageBlock = { username: "", messageContent: [] };
    for (let i = 0; i < messageHistoryList.length; i++) {
      let messageHistoryObject = messageHistoryList[i];

      if (currentMessageBlock.username !== messageHistoryObject.username) {
        formattedMessageHistory.push(currentMessageBlock);
        currentMessageBlock = {
          username: messageHistoryObject.username,
          messageContent: [messageHistoryObject],
        };
      } else {
        currentMessageBlock.messageContent.push(messageHistoryObject);
      }
    }
    formattedMessageHistory.push(currentMessageBlock);
    return formattedMessageHistory;
  }
  const messageHistoryToObjectList = (messageHistory) => {
    let messageHistoryObjectList = [];

    for (let i = 0; i < messageHistory.length; i++) {
      let messageHistoryObject = {};

      messageHistoryObject['messageID'] = messageHistory[i][0];
      messageHistoryObject['message'] = messageHistory[i][1];
      messageHistoryObject['dateTime'] = parseDate(messageHistory[i][2]);
      messageHistoryObject['userID'] = messageHistory[i][3];
      messageHistoryObject['username'] = messageHistory[i][4];

      messageHistoryObjectList.push(messageHistoryObject);
    }


    return messageHistoryObjectList;
  }

  const handleIncomingData = (data) => {

    const parsedData = JSON.parse(data);

    const newMessage = messageHistoryToObjectList(parsedData['messages']);

    const messages = [...messageList, ...newMessage]
    
    console.log(messageList);
    
    setMessageList(prevList => [...prevList, ...newMessage]);

    setMessageHistory(formatMessageHistory(messages));
  };



  const parseDate = (dateString) => {
    //The database is expected to output YYYY-MM-DD HH:MM:MM (this comes from json.dumps(default=str) in python)
    //The database stores values in GMT by default

    let newDate = new Date(Date.parse(dateString + " " + databaseTimezone))

    let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    let formattedNewDate = newDate.toLocaleString('en-US', options);

    return formattedNewDate;


  }
  const createDisconnectMessage = () => {
    disconnectMessage = (
      <div style={{ color: 'red' }}> Your session has expired! Click here to redirect yourself to the login page.</div>
    );
  }


  useEffect (() => {
    const newSocket = io("http://localhost:5000/", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000",
      },
    });

    setSocket(newSocket);

    getMessageHistory();
    return () => {
      if (socket !== null){
        socket.disconnect();
      }
      
    }
  }, [])
  useEffect(() => {

    if (socket !== null) {
      socket.on('connect', () => {
        setIsConnected(true);
        props.setAppState("chat");
      });
      
      socket.on('disconnect', () => {
        console.log('disconnect');
        setIsConnected(false);
      });

      socket.on('data', (data) => {
        console.log("test")
        handleIncomingData(data);
      });
      
      
    } 
    return () => {
      if (socket !== null) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('data');
      }
    }
  }, [socket])



  return (
    <div className='chatWindowContainer'>
      <MessageHistory messageHistory={messageHistory} setMessageHistory={setMessageHistory} />
      <div className='sendContainer'>
        <UserInput message={message} setMessage={setMessage} sendMessage={sendMessage} socket={socket} />
        <button onClick={sendMessage}>{isConnected + " send"}</button>

      </div>
    </div>
  );
}

export default ChatWindow;