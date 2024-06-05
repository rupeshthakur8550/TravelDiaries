import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from "react-icons/io5";
import { TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';

const Chats = ({ fetchAgain, setFetchAgain, selectedChatId, isGroupChat }) => {
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
    }, [messages]);

    // Helper function to group messages by sender and timestamp
    const groupMessages = (messages) => {
        const grouped = [];
        let currentGroup = null;

        messages.forEach(message => {
            const messageTime = new Date(message.createdAt).getTime();
            if (currentGroup && currentGroup.sender._id === message.sender._id) {
                const lastMessageTime = new Date(currentGroup.messages[currentGroup.messages.length - 1].createdAt).getTime();
                if (messageTime - lastMessageTime < 5 * 60 * 1000) { // 5 minutes threshold
                    currentGroup.messages.push(message);
                    currentGroup.lastTime = message.createdAt;
                } else {
                    grouped.push(currentGroup);
                    currentGroup = {
                        sender: message.sender,
                        messages: [message],
                        lastTime: message.createdAt
                    };
                }
            } else {
                if (currentGroup) {
                    grouped.push(currentGroup);
                }
                currentGroup = {
                    sender: message.sender,
                    messages: [message],
                    lastTime: message.createdAt
                };
            }
        });

        if (currentGroup) {
            grouped.push(currentGroup);
        }

        return grouped;
    };

    const groupedMessages = groupMessages(messages);

    return (
        <div className='flex m-1 flex-col justify-end bg-[#E8E8E8] sm:h-[75.7vh] h-[70.8vh] overflow-y-hidden'>
            {loading ? (
                <div className='flex justify-center items-center h-full'>
                    <h1 className='text-center text-3xl animate-pulse'>Loading .....</h1>
                </div>
            ) : (
                <div ref={historyRef} className='flex flex-col overflow-y-auto p-2' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {groupedMessages.map(group => (
                        <div key={group.messages[0]._id} className={`flex flex-col items-${group.sender._id === currentUser._id ? 'end' : 'start'} my-1`}>
                            <div className="flex items-end">
                                {isGroupChat && group.sender._id !== currentUser._id && (
                                    <div className='w-52 sm:w-24 md:w-40 lg:w-20'>
                                        <img
                                            src={group.sender.profilePicture}
                                            alt={group.sender.name}
                                            className="w-8 h-8 mr-2 rounded-full mb-[1.44rem]"
                                        />
                                    </div>
                                )}
                                {!isGroupChat && group.sender._id !== currentUser._id && (
                                    <img
                                        src={group.sender.profilePicture}
                                        alt={group.sender.name}
                                        className="sm:w-8 w-[3.9rem] h-8 mr-2 rounded-full mb-[1.44rem]"
                                    />
                                )}
                                <div>
                                    {group.sender._id !== currentUser._id && (
                                        <span className='text-xs font-bold text-left ml-1'>
                                            {group.sender.name}
                                        </span>
                                    )}
                                    {group.messages.map((message, index) => (
                                        <div key={message._id} className="flex flex-col">
                                            <div className={`p-[0.42rem] rounded-md text-sm text-wrap ${group.sender._id === currentUser._id ? 'bg-blue-600 text-white md:ml-32 ml-10' : 'bg-orange-200 text-gray-950 md:mr-32 mr-10'}`}>
                                                {message.content}
                                            </div>
                                            {index === group.messages.length - 1 && (
                                                <div className={`text-xs text-gray-500 mt-1 ${group.sender._id === currentUser._id ? 'text-right mr-1' : 'text-left ml-1'} mb-1`}>
                                                    {formatDistanceToNow(new Date(group.lastTime), { addSuffix: true })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
