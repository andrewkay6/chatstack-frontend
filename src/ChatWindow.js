import React, { useEffect, useState, useCallback } from 'react';
import MessageHistory from './MessageHistory';
import UserInput from './UserInput';
import io from 'socket.io-client';
import SettingsBar from './SettingsBar';
import Modal from './Modal';
import LogoutWindow from './LogoutWindow';
import SettingsWindow from './SettingsWindow';


const ChatWindow = ({setAppState}) => {
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
  const databaseTimezone = "GMT";

  const parseIncomingMessages = useCallback ((incomingMessages) => {
    let parsedMessages = [];

    for (let i = 0; i < incomingMessages.length; i++) {
      let messageHistoryObject = {};

      messageHistoryObject['messageID'] = incomingMessages[i][0];
      messageHistoryObject['message'] = incomingMessages[i][1];
      messageHistoryObject['dateTime'] = parseDate(incomingMessages[i][2]);
      messageHistoryObject['userID'] = incomingMessages[i][3];
      messageHistoryObject['username'] = incomingMessages[i][4];
      messageHistoryObject['userColor'] = incomingMessages[i][5];
      messageHistoryObject['profilePictureURL'] = incomingMessages[i][6];

      parsedMessages.push(messageHistoryObject);
    }

    return parsedMessages;
  },[])


  const disconnectClient = () => {
    socket.disconnect();
  }
  const getMessageHistory = useCallback (async () => {
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
  },[parseIncomingMessages, messageList])

  const sendMessage = () => {
    socket.emit("send_message", JSON.stringify({ message: message }));
    setMessage("");
  }

  const formatMessageHistory = (messageHistoryList) => {
    let formattedMessageHistory = [];
    let currentMessageBlock = { username: "", userColor: "", profilePictureURL: "", messageContent: [] };
    for (let i = 0; i < messageHistoryList.length; i++) {
      let messageHistoryObject = messageHistoryList[i];

      if (currentMessageBlock.username !== messageHistoryObject.username) {
        formattedMessageHistory.push(currentMessageBlock);
        currentMessageBlock = {
          username: messageHistoryObject.username,
          userColor: messageHistoryObject.userColor,
          profilePictureURL: messageHistoryObject.profilePictureURL,
          messageContent: [messageHistoryObject],
        };
      } else {
        currentMessageBlock.messageContent.push(messageHistoryObject);
      }
    }
    formattedMessageHistory.push(currentMessageBlock);
    formattedMessageHistory.shift()
    return formattedMessageHistory;
  }

  const handleIncomingData = useCallback((data) => {

    const parsedData = JSON.parse(data);
    const newMessage = parseIncomingMessages(parsedData['messages']);
    setMessageList(prevList => [...prevList, ...newMessage]);
  },[parseIncomingMessages])

  const parseDate = (dateString) => {
    //The database is expected to output YYYY-MM-DD HH:MM:MM (this comes from json.dumps(default=str) in python)
    //The database stores values in GMT by default
    let newDate = new Date(Date.parse(dateString + " " + databaseTimezone))

    let options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }

    let formattedNewDate = newDate.toLocaleString('en-US', options);
    return formattedNewDate;
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
  },[])

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