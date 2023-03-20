import React, { useState } from "react";

const SignUp = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    

    //let warningMessage = (<div style={{color: "red"}}>Passwords must match!</div>);
    let warningMessage = (<></>);
    const handleReturnToWelcomePagePress = () => {
        props.setAppState("welcomePage");
    }

    const handleSubmitClick = async () => {
        if (password !== repeatPassword){
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/javascript, */*; q=0.01',
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password }),
          }

        const response = await fetch('http://localhost:5000/api/create-user', requestOptions);
        const data = await response.json();
  
        console.log(data);
    }

    return (
        <>
        <div>Sign up</div>
        <label htmlFor="username">username:</label>
        <input id="username"onChange={(e) => {setUsername(e.target.value)}}></input><br/>
        <label htmlFor="password">password:</label>
        <input id="password" onChange={(e) => {setPassword(e.target.value)}}></input> <br/>
        <label htmlFor="passwordRepeat">repeat password:</label>
        <input id="passwordRepeat" onChange={(e) => {setRepeatPassword(e.target.value)}}></input><br/>
        {warningMessage}
        <button id="submit" onClick={handleSubmitClick}>Submit</button><br/>
        <button id="returnToWelcomePage" onClick={handleReturnToWelcomePagePress}>Return to welcome page</button>
        </>
    );
}

export default SignUp;