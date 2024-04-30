import React, { useEffect, useState } from 'react';
import { useChatState } from './Context/ChatProvider';
import { PiArrowFatLineLeftFill } from "react-icons/pi";
import { Avatar } from 'flowbite-react';

const ChatBox = ({ fetchAgain }) => {
    const { selectedChat } = useChatState();
    return (
        <div className={`md:w-[50%] lg:w-[70%] w-[90%] border-4 border-green-300 rounded-lg relative ${selectedChat ? 'block' : 'hidden'} md:block`}>
            {!selectedChat ? (
                <>
                    <h1 className='text-center mt-3 font-semibold font-mono text-xl'>ChatBox</h1>
                    <hr className="mt-3 border-t-2 border-gray-300" />
                    <div className='flex justify-center items-center h-full'>
                        <div className="text-gray-500 text-center">
                            <p className="mb-4 font-semibold text-base">Select a user to start chatting!</p>
                            <img src="https://cdn-icons-png.flaticon.com/512/4470/4470335.png" alt="Select User Illustration" className="mx-auto w-1/2" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-row justify-between md:justify-center mx-3'>
                        <PiArrowFatLineLeftFill className='mt-4 w-10 h-5 block md:hidden' />
                        <h1 className='mt-1 text-lg' style={{ fontVariant: 'unicase' }}>
                            <div className="flex gap-3 mt-2">
                                <Avatar
                                    alt={selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users[1].username}
                                    img={selectedChat.isGroupChat ? "https://cdn-icons-png.flaticon.com/512/681/681494.png" : selectedChat.users[1].profilePicture}
                                    rounded
                                    className="w-10 h-7"
                                />
                                <span>{selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users[1].username}</span>
                            </div>
                        </h1>
                        <h1></h1>
                    </div>
                    <hr className="mt-2 border-t-2 border-gray-300" />
                </>
            )}
        </div>

    );
};

export default ChatBox;
