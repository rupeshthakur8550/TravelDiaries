import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import ChatProvider from './Context/ChatProvider'

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div className='mt-20 md:px-10 flex justify-center object-center w-full h-[85vh] gap-5'>
            <ChatProvider>
                <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </ChatProvider>
        </div>
    );
};

export default ChatPage;