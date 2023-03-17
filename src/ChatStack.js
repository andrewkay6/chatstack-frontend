import React, {useState} from "react";
import WelcomePage from "./WelcomePage";
import LoginScreen from "./LoginScreen";
import SignUp from "./SignUp";
import ChatWindow from "./ChatWindow";


const ChatStack = () => {
    const [appState, setAppState] = useState("welcomePage");
    const [loggedIn, setLoggedIn] = useState(false);

    let pageContents = (<></>);
    if (appState === "welcomePage"){
        pageContents = (
            <WelcomePage appState={appState} setAppState={setAppState}/>
        );
    }
    if (appState === "signUp"){
        pageContents = (
            <SignUp appState={appState} setAppState={setAppState}/>
        );
    
    }
    if (appState === "chat"){
        pageContents = (
            <ChatWindow username="test"/>
        );
        
    }


    return (
        <>
        {appState}
        {pageContents}
        </>
    );
}


export default ChatStack;