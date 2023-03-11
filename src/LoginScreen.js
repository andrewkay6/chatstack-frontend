import React from "react";
import { useState } from "react";

const LoginScreen = () => {

    const [loginState, setLoginState] = useState("oldUser");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("")

    const testLogin = async () => {

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

        console.log(data);
    }

    const submitLogin = async () => {
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

        console.log(data);



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
            <h1>User Login</h1>
            <label htmlFor='username'>username: </label>
            <input id="username" value={username} onChange={(e) => { setUsername(e.target.value) }}></input>

            <label htmlFor='password'>password: </label>
            <input id="password" value={password} onChange={(e) => { setPassword(e.target.value) }}></input>


            <button id="login" onClick={submitLogin}>login</button> <br />

            <button id="testLogin" onClick={testLogin}>test</button>

        </div>

    );
}

export default LoginScreen;