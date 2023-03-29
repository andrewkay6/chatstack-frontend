import React from "react";

const Modal = ({handleClose, showModalWindow, children}) => {
    const showHideClassName = showModalWindow ? "modal display-block" : "modal display-none";

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