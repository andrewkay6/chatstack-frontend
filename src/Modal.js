import React from "react";

const Modal = ({handleClose, show, children}) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <div className="modalMain">
                {children}
                <button onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default Modal;