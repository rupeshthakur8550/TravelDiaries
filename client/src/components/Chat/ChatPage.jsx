import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MyChats from './MyChats';

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div className='mt-20 md:px-10 flex justify-center object-center w-full h-[85vh] gap-5'>
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatPage;