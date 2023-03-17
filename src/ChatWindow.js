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
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [username, setUsername] = useState(props.username);
    
    let disconnectMessage = (<></>);

    const sendMessage = () => {
        socket.emit("send_message", JSON.stringify({message : message, username: username}));
        setMessage("");
    }
    const handleIncomingData = (data) => {

        const parsedData = JSON.parse(data);
        console.log(parsedData)
  
        setMessageHistory(prevMessageHistory => [...prevMessageHistory, parsedData]);
      };
    
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
            createDisconnectMessage();
            setIsConnected(false);
        });

        socket.on('data', (data) =>{
            console.log('test')

            handleIncomingData(data);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('data');
        }
    }, [])


    return (
        <>
        <MessageHistory messageHistory = {messageHistory} setMessageHistory = {setMessageHistory}/>
        <UserInput message = {message} setMessage = {setMessage}/>
        <button onClick={sendMessage}>send</button>
        {disconnectMessage}

        </>
    );
}

export default ChatWindow;