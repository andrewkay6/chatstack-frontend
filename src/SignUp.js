import React, { useState } from "react";

const SignUp = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    let warningMessage = (<></>);
    const handleReturnToWelcomePagePress = () => {
        props.setAppState("welcomePage");
    }

    const handleSubmitClick = async () => {
        if (password !== repeatPassword) {
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
            <div className="signUpPageTitle">Sign up</div>
            <div className="signUpPageInputContainer">
                <input id="username"
                    placeholder="Username"
                    onChange={(e) => { setUsername(e.target.value) }}></input>
                <input id="password"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => { setPassword(e.target.value) }}></input>
                <input id="passwordRepeat"
                    placeholder="Repeat Password"
                    type="password"
                    onChange={(e) => { setRepeatPassword(e.target.value) }}></input>
                {warningMessage}
                <button id="submit"
                    onClick={handleSubmitClick}>Submit</button>
            </div>




            <button id="returnToWelcomePage"
                onClick={handleReturnToWelcomePagePress}>Return to welcome page</button>
        </>
    );
}

export default SignUp;