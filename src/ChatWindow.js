import React, { useEffect, useState } from 'react';
import MessageHistory from './MessageHistory';
import UserInput from './UserInput';
import io from 'socket.io-client';
import SettingsBar from './SettingsBar';
import Modal from './Modal';
import LogoutWindow from './LogoutWindow';
import SettingsWindow from './SettingsWindow';


import { parseIncomingMessages, formatMessageHistory, parseDate } from './ChatParsingTools';

const ChatWindow = ({ setAppState }) => {
  //This state variable controls the message history that the window will actually display. 
  //It groups messages from messageList by username.
  const [messageHistory, setMessageHistory] = useState([]);
  //This state variable contains the actual message history as a list of objects.
  const [messageList, setMessageList] = useState([]);
  //This is the message that the user is currently typing.
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [socket, setSocket] = useState(null);
  const [showModalWindow, setShowModalWindow] = useState(false);
  const [modalWindowState, setModalWindowState] = useState("");
  const [modalWindowContents, setModalWindowContents] = useState((<></>));


  const numberOfMessagesToPreload = "50";

  const disconnectClient = () => {
    socket.disconnect();
  }
  const getMessageHistory = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ numberOfMessages: numberOfMessagesToPreload, startFromID: "" }),
    }

    const response = await fetch('http://localhost:5000/api/fetch-newest-messages', requestOptions);
    const data = await response.json();
    const messages = parseIncomingMessages(data['messages']).reverse();

    setMessageList(messages);
    setMessageHistory(formatMessageHistory(messages));
  }

  const sendMessage = () => {
    socket.emit("send_message", JSON.stringify({ message: message }));
    setMessage("");
  }


  const handleIncomingData = (data) => {

    const parsedData = JSON.parse(data);
    const newMessage = parseIncomingMessages(parsedData['messages']);
    setMessageList(prevList => [...prevList, ...newMessage]);
  }


  const closeModalWindow = () => {
    setShowModalWindow(false);
  }

  const reconnect = () => {
    console.log('reconnect');
  }
  useEffect(() => {
    const newSocket = io("http://localhost:5000/", {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000",
      },
    });
    setSocket(newSocket);
    getMessageHistory();

    return () => {
      if (socket !== null) {
        socket.disconnect();
      }

    }
    // This effect is only used on mount, so the linter message is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  useEffect(() => {
    if (socket !== null) {
      socket.on('connect', () => {
        setIsConnected(true);
        setAppState("chat");
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('data', (data) => {
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
  }, [socket, handleIncomingData, setAppState])

  useEffect(() => {
    setMessageHistory(formatMessageHistory(messageList));
  }, [messageList]);

  useEffect(() => {
    switch (modalWindowState) {
      case "logout":
        setModalWindowContents(
          <LogoutWindow
            setAppState={setAppState}
            handleDisconnect={disconnectClient}
          />
        );
        break;
      case "settings":
        setModalWindowContents(
          <SettingsWindow
          />
        );
        break;
      default:
        break;
    }
  }, [modalWindowState])

  return (
    <>
      <SettingsBar
        showModalWindow={showModalWindow}
        setShowModalWindow={setShowModalWindow}
        setModalWindowState={setModalWindowState}
        isConnected={isConnected}
        reconnect={reconnect}
      />
      <Modal
        handleClose={closeModalWindow}
        children={modalWindowContents}
        showModalWindow={showModalWindow}
      />
      <div className='chatWindowContainer'>
        <MessageHistory
          messageHistory={messageHistory}
          setMessageHistory={setMessageHistory}
        />
        <div className='sendContainer'>
          <UserInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            socket={socket}
            isConnected={isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected}>
            {"Send"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;