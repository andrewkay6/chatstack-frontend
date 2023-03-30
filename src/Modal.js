import React, { useRef, useEffect } from "react";

const Modal = ({ handleClose, showModalWindow, children }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                showModalWindow
            ) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, handleClose, showModalWindow]);

    const showHideClassName = showModalWindow ? "modal" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <div className="modalMain" ref={modalRef}>
                {children}
            </div>
        </div>
    );
};

export default Modal;