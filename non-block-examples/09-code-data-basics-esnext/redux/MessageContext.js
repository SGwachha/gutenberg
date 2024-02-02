import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState(null);

    const showMessage = (msg) => {
        setMessage(msg);
    };

    return (
        <MessageContext.Provider value={{ message, showMessage }}>
            {children}
        </MessageContext.Provider>
    );
};