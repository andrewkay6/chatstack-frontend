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

const ChatStack = () => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [username, setUsername] = useState("");
    
    const sendMessage = () => {
        socket.emit("send_message", JSON.stringify({message : message, username: username}));
        setMessage("");
    }
    const handleIncomingData = (data) => {
        
        setMessageHistory(...messageHistory, data )

    }
    
    useEffect(() => {

        socket.on('connect', () =>{
            setIsConnected(true);
        });

        socket.on('data', (data) =>{
            handleIncomingData(data['data']);
            console.log(data['data']);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        }
    }, [])


    return (
        <>
        <label htmlFor='userName'>username: </label>
        <input id="userName"></input>
        <MessageHistory messageHistory = {messageHistory} setMessageHistory = {setMessageHistory}/>
        <UserInput message = {message} setMessage = {setMessage}/>
        
        <button onClick={sendMessage}>send</button>
        </>
    );
}

export default ChatStack;