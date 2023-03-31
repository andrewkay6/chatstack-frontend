const databaseTimezone = "GMT";

//This function takes a list of message history objects from the database and parses them into a more readable format.
const parseIncomingMessages = (incomingMessages) => {
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
}

//This function takes a list of message history objects and groups them by username.
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

//This function takes a date string from the database and converts it to a more readable format.
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


export { parseIncomingMessages, formatMessageHistory, parseDate };