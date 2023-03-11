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

        const parsedData = JSON.parse(data);
  
        setMessageHistory(prevMessageHistory => [...prevMessageHistory, parsedData]);
      };
    
    useEffect(() => {

        socket.on('connect', () =>{
            setIsConnected(true);
        });
        socket.on('disconnect', () =>{
            setIsConnected(false);
        });

        socket.on('data', (data) =>{
            console.log('test')
            handleIncomingData(data['data']);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('data');
        }
    }, [])


    return (
        <>
        <label htmlFor='userName'>username: </label>
        <input id="userName" value={username} onChange={ (e) => {setUsername(e.target.value)}}></input>
        <MessageHistory messageHistory = {messageHistory} setMessageHistory = {setMessageHistory}/>
        <UserInput message = {message} setMessage = {setMessage}/>
        
        <button onClick={sendMessage}>send</button>
        </>
    );
}

export default ChatStack;