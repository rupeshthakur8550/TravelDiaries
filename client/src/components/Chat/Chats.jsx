import React, { useState, useEffect } from 'react';
import { IoSend } from "react-icons/io5";
import { TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

const Chats = ({ fetchAgain, setFetchAgain, selectedChatId }) => {
    const { currentUser } = useSelector(state => state.user);
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

    return (
        <div className='flex m-1 flex-col justify-end bg-[#E8E8E8] sm:h-[67.7vh] h-[69vh] overflow-y-hidden'>
            {loading ? (
                <div className='flex justify-center items-center h-full'>
                    <h1 className='text-center text-3xl animate-pulse'>Loading .....</h1>
                </div>
            ) : (
                <div className='flex flex-col overflow-y-auto p-2'>
                    {messages.map((message) => (
                        <div key={message._id} className={`flex items-center my-2 ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                            {message.sender._id !== currentUser._id && (
                                <img
                                    src={message.sender.profilePicture}
                                    alt={message.sender.name}
                                    className='w-8 h-8 rounded-full mr-2'
                                />
                            )}
                            <div className={`p-2 rounded-md ${message.sender._id === currentUser._id ? 'bg-blue-600 text-white' : 'bg-orange-200 text-gray-950'}`}>
                                {message.content}
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
