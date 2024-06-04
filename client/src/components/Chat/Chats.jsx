import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from "react-icons/io5";
import { TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const Chats = ({ fetchAgain, setFetchAgain, selectedChatId }) => {
    const { currentUser } = useSelector(state => state.user);
    const historyRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    // Function to fetch messages
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/message/getmessages/${selectedChatId}`);
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            } else {
                console.error('Error fetching messages', data.message);
            }
        } catch (error) {
            console.log('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    // Use effect to fetch messages when component mounts or selectedChatId changes
    useEffect(() => {
        if (selectedChatId) {
            fetchMessages();
        }
    }, [selectedChatId, fetchAgain]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage) {
            setNewMessage('');
            try {
                const response = await fetch('api/message/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: newMessage,
                        chatId: selectedChatId,
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    setMessages([...messages, data]);
                    setFetchAgain(!fetchAgain);
                } else {
                    console.error('Error sending message', data.message);
                }
            } catch (error) {
                console.log('Error sending message', error);
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages]); // Changed from 'history' to 'messages'

    return (
        <div className='flex m-1 flex-col justify-end bg-[#E8E8E8] sm:h-[75.7vh] h-[78vh] overflow-y-hidden'>
            {loading ? (
                <div className='flex justify-center items-center h-full'>
                    <h1 className='text-center text-3xl animate-pulse'>Loading .....</h1>
                </div>
            ) : (
                <div ref={historyRef} className='flex flex-col overflow-y-auto p-2 scrollbar-hide' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {messages.map((message) => (
                        <div key={message._id} className={`flex flex-col items-${message.sender._id === currentUser._id ? 'end' : 'start'} my-1`}>
                            <div className="flex items-center">
                                {message.sender._id !== currentUser._id && (
                                    <img
                                        src={message.sender.profilePicture}
                                        alt={message.sender.name}
                                        className='w-8 h-8 rounded-full mr-2 mt-1'
                                    />
                                )}
                                <div>
                                    {message.sender._id !== currentUser._id && (
                                        <span className='text-xs font-bold text-left ml-1'>
                                            {message.sender.name}
                                        </span>
                                    )}
                                    <div className={`p-[0.42rem] rounded-md text-sm ${message.sender._id === currentUser._id ? 'bg-blue-600 text-white' : 'bg-orange-200 text-gray-950'}`}>
                                        {message.content}
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${message.sender._id === currentUser._id ? 'text-right mr-1' : 'text-left ml-1'}`}>
                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={sendMessage} className='m-2 flex justify-center items-center'>
                <TextInput
                    id='message'
                    type="text"
                    className="border-b w-[97%]"
                    placeholder='Enter Message'
                    onChange={typingHandler}
                    value={newMessage}
                />
                <IoSend className='w-6 h-6 ml-2 cursor-pointer' onClick={sendMessage} />
            </form>
        </div>
    );
};

export default Chats;
