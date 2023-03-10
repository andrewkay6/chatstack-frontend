import React from "react"

const UserInput = (props) => {
    const handleChange = (event) => {
        props.setMessage(event.target.value)
    }
    return (
        <>
        <textarea onChange={handleChange} value={props.message}></textarea>
        </>
    );
}

export default UserInput;