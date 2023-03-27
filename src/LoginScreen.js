import React from "react";
import { useState, useEffect } from "react";

const LoginScreen = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("")
    const [loginMessage, setLoginMessage] = useState((<></>));
    const [enableButtons, setEnableButtons] = useState(true);

    const tryLogin = async () => {

        console.log(token)
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
            },
            credentials: 'include'

        };

        console.log(requestOptions)
        const response = await fetch('http://localhost:5000/api/getsession', requestOptions);
        const data = await response.json();

        if (data['messageType'] === 'S') {
            props.setAppState("chat");
        }
    }
    const submitLogin = async () => {
        setEnableButtons(false);
        await getCSRF();

        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                "Content-Type": "application/json",
                "X-CSRFToken": token
            },
            credentials: "include",
            body: JSON.stringify({ username: username, password: password }),
        }

        const response = await fetch('http://localhost:5000/api/login', requestOptions);
        const data = await response.json();

        handleLoginResult(data);

        setEnableButtons(true);

        console.log(data);



    }
    const handleLoginResult = (data) => {
        if (data['messageType'] === 'E') {
            setLoginMessage(<div style={{ color: "red" }}>{data['message']}</div>)
        }
        if (data['messageType'] === 'S') {
            console.log('setChat')
            props.setAppState('chat');
        }
    }
    const getCSRF = async () => {
        const requestOptions = {
            method: 'GET',
            credentials: 'same-origin'
        };

        const response = await fetch('http://localhost:5000/api/getcsrf', requestOptions);
        const data = (response.headers.get("X-CSRFToken"))

        setToken(data);
        console.log(data);
    }


    return (
        <div className="loginScreenContainer">
            <div className="loginScreenInputContainer">
                <input id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                    disabled={!enableButtons} />
                <br />
                <input id="password"
                    value={password}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => { setPassword(e.target.value) }} disabled={!enableButtons}></input>
                <br />
            </div>

            <button id="login" onClick={submitLogin} disabled={!enableButtons}>Login</button>
           
            <br />
            {loginMessage}

        </div>

    );
}

export default LoginScreen;