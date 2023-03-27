import React from "react"

const UserInput = (props) => {
    const handleChange = (event) => {
        props.setMessage(event.target.value)
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
        <textarea onChange={handleChange} value={props.message} onKeyDown={handleKeyPress}></textarea>
        </>
    );
}

export default UserInput;