const numberOfMessagesToPreload = "50";

const fetchMessageHistory = async () => {
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
    
    return data;
  }

  const fetchUserInfo = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    }
  }

  export {fetchMessageHistory, fetchUserInfo}