import React from "react"
let maxInputLength = 500;


const UserInput = (props) => {
    const handleChange = (event) => {
        if (event.target.value.length <= maxInputLength){
            props.setMessage(event.target.value)
        }
        else{
            props.setMessage(event.target.value.substring(0,maxInputLength));
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter'){
            props.sendMessage();
        }
    }

    const isSendShortcut = (event) => {
        return (event.key === 'Enter' && !(event.shiftKey));
    }
    return (
        <>
        <textarea 
        onChange={handleChange} 
        value={props.message} 
        spellCheck="true"
        onKeyDown={handleKeyPress}></textarea>
        
        </>
    );
}

export default UserInput;