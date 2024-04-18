import React from 'react';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import ChatProvider from './Context/ChatProvider'

const ChatPage = () => {
    return (
        <div className='my-20 md:ml-20 flex justify-center object-center w-[100%] md:w-[90%] h-[77vh] gap-5'>
            <ChatProvider>
                <MyChats />
                <ChatBox />
            </ChatProvider>
        </div>
    );
};

export default ChatPage;