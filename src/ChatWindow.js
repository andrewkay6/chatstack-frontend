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

const ChatWindow = (props) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    const [username, setUsername] = useState(props.username);
    const databaseTimezone = "GMT"
    let disconnectMessage = (<></>);


    const getMessageHistory = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              "Content-Type": "application/json", 
            },
            credentials: "include",
            body: JSON.stringify({ numberOfMessages: "10", startFromID: "" }),
          }

        const response = await fetch('http://localhost:5000/api/fetch-newest-messages', requestOptions);
        const data = await response.json();

        setMessageHistory(formatMessageHistory(data['messages']).reverse());
    }
    const sendMessage = () => {
        socket.emit("send_message", JSON.stringify({message : message, username: username}));
        setMessage("");
    }
    
    const formatMessageHistory = (messageHistoryJSON) => {
        let formattedMessageHistory = [];
        let currentMessageBlock = {username : null, messageContent : []};
        for (let i = 0; i < messageHistoryJSON.length; i++){
            let messageHistoryObject = {};
      
            messageHistoryObject['messageID'] = messageHistoryJSON[i][0];
            messageHistoryObject['message'] = messageHistoryJSON[i][1];
            messageHistoryObject['dateTime'] = parseDate(messageHistoryJSON[i][2]);
            messageHistoryObject['userID'] = messageHistoryJSON[i][3];
            messageHistoryObject['username'] = messageHistoryJSON[i][4];

            if (i === (messageHistoryJSON.length - 1)){
                currentMessageBlock['username'] = messageHistoryObject['username']
            }
            if(currentMessageBlock['username'] === messageHistoryObject['username']) {             
                formattedMessageHistory.push(currentMessageBlock);
                currentMessageBlock = {username : messageHistoryObject['username'] , messageContent : [{messageHistoryObject}]};
              
            }
            else {
                currentMessageBlock['messageContent'].push(messageHistoryObject);
            }
            

            
        }
        return formattedMessageHistory;
    }
    const handleIncomingData = (data) => {

        const parsedData = JSON.parse(data);
        console.log(parsedData)
        let formattedMessageHistory = formatMessageHistory(parsedData['messages']);
        setMessageHistory(prevMessageHistory => [...prevMessageHistory, ...formattedMessageHistory]);
      };
    
      
    const parseDate = (dateString) => {
        //The database is expected to output YYYY-MM-DD HH:MM:MM (this comes from json.dumps(default=str) in python)
        //The database stores values in GMT by default

        let newDate = new Date(Date.parse(dateString +  " " + databaseTimezone))

        //newDateString = Date.parse(newDateString)
        let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        let formattedNewDate = newDate.toLocaleString('en-US', options);

        return formattedNewDate;
        //return newDate.toString();

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
            <UserInput message = {message} setMessage = {setMessage}/>
            <button onClick={sendMessage}>send</button>
        </div>
        </div>
    );
}

export default ChatWindow;