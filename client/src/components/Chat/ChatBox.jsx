import React, { useEffect, useState } from 'react';
import { useChatState } from './Context/ChatProvider';

const ChatBox = ({ fetchAgain }) => {
    const { setSelectedChat, chats, selectedChat, setChats } = useChatState();
    return (
        <div className='hidden md:block w-[70%] border-4 border-green-300 rounded-lg'>
            <h1 className='text-center mt-3 font-semibold font-mono text-xl'>ChatBox</h1>
            <hr className="mt-3 border-t-2 border-gray-300" />

        </div>
    );
};

export default ChatBox;
