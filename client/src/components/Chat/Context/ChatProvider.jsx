import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatState = () => useContext(ChatContext);

export default ChatProvider;
