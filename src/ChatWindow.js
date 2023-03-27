import React, { useEffect, useState } from 'react';
import MessageHistory from './MessageHistory';
import UserInput from './UserInput';
import io, { Socket } from 'socket.io-client';


const socket = io("localhost:5000/", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000",
    },
  });

const numberOfMessagesToPreload = "50";
const databaseTimezone = "GMT";

const ChatWindow = (props) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    const [username, setUsername] = useState(props.username);
    
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
        socket.emit("send_message", JSON.stringify({message : message, username: username}));
        setMessage("");
    }
    
    const formatMessageHistory = (messageHistoryList) => {
        let formattedMessageHistory = [];
        let currentMessageBlock = {username: "", messageContent: []};
        for (let i = 0; i < messageHistoryList.length; i++) {
          let messageHistoryObject = messageHistoryList[i];
      
          if ( currentMessageBlock.username !== messageHistoryObject.username) {
            formattedMessageHistory.push(currentMessageBlock);
            currentMessageBlock = {
              username: messageHistoryObject.username,
              messageContent: [messageHistoryObject],
            };
          } else {
            currentMessageBlock.messageContent.push(messageHistoryObject);
          }
        }
        formattedMessageHistory.push(currentMessageBlock); // add the last message block
        return formattedMessageHistory;
      }
    const messageHistoryToObjectList = (messageHistory) => {
        let messageHistoryObjectList = [];
        
        for (let i = 0; i < messageHistory.length; i++){
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

        let newMessage = messageHistoryToObjectList(parsedData['messages']);
        const messages = (oldMessageHistory => [... oldMessageHistory, ...newMessage])
        setMessageList(messages);
        setMessageHistory(formatMessageHistory(messages));

      };
    
    
      
    const parseDate = (dateString) => {
        //The database is expected to output YYYY-MM-DD HH:MM:MM (this comes from json.dumps(default=str) in python)
        //The database stores values in GMT by default

        let newDate = new Date(Date.parse(dateString +  " " + databaseTimezone))

        let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        let formattedNewDate = newDate.toLocaleString('en-US', options);

        return formattedNewDate;
        

    } 
    const createDisconnectMessage = () => {
        disconnectMessage = (
            <div style={{color: 'red'}}> Your session has expired! Click here to redirect yourself to the login page.</div>
        );
    }
    
    useEffect(() => {

        socket.on('connect', () =>{
            setIsConnected(true);
        });
        socket.on('disconnect', () =>{
            console.log('disconnect');
            setIsConnected(false);
        });

        socket.on('data', (data) =>{
            handleIncomingData(data);
        });
        
        getMessageHistory();
        
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('data');
        }
    }, [])


    return (
        <div className='chatWindowContainer'>
        <MessageHistory messageHistory = {messageHistory} setMessageHistory = {setMessageHistory}/>
        <div className='sendContainer'>
            <UserInput message = {message} setMessage = {setMessage} sendMessage = {sendMessage}/>
            <button onClick={sendMessage}>send</button>
        </div>
        </div>
    );
}

export default ChatWindow;