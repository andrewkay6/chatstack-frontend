import React, {useState} from "react";
import WelcomePage from "./WelcomePage";
import SignUp from "./SignUp";
import ChatWindow from "./ChatWindow";
import "./ChatStack.css";

const ChatStack = () => {
    const [appState, setAppState] = useState("welcomePage");

    let pageContents = (<></>);
    if (appState === "welcomePage"){
        pageContents = (
            <div className="welcomeContainer">
                <WelcomePage appState={appState} setAppState={setAppState}/>
            </div>
        );
    }
    if (appState === "signUp"){
        pageContents = (
            <div className="signUpContainer">
                <SignUp appState={appState} setAppState={setAppState}/>
            </div>
        );
    }
    if (appState === "chat"){
        pageContents = (
            <div className="chatContainer">
                <ChatWindow appState={appState} setAppState={setAppState}/>            
            </div>
        );
        
    }
    return (
        <div className="appContainer">
        {pageContents}
        </div>
    );
}


export default ChatStack;