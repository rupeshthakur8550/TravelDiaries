import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from "react-icons/io5";
import { TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_ENDPOINT_SOCKET;
let socket;

const Chats = ({ fetchAgain, setFetchAgain, selectedChatId, isGroupChat }) => {
    const { currentUser } = useSelector(state => state.user);
    const historyRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const previousMessagesRef = useRef([]);

    useEffect(() => {
        if (!socket) {
            socket = io(ENDPOINT);
            socket.emit('setup', currentUser);
            socket.on('connection', () => setSocketConnected(true));
        }
    }, [currentUser]);

    useEffect(() => {
        if (socket) {
            socket.on('message received', (newMessageReceived) => {
                if (newMessageReceived.chat._id === selectedChatId) {
                    setMessages((prevMessages) => {
                        if (!prevMessages.find(msg => msg._id === newMessageReceived._id)) {
                            return [...prevMessages, newMessageReceived];
                        }
                        return prevMessages;
                    });
                }
            });
        }
    }, [selectedChatId]);

    useEffect(() => {
        if (selectedChatId) {
            fetchMessages();
        }
    }, [selectedChatId, fetchAgain]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/message/getmessages/${selectedChatId}`);
            const data = await response.json();
            if (response.ok) {
                setMessages(data.map(message => ({ ...message, isRead: message.chat._id === selectedChatId })));
                socket.emit('join chat', selectedChatId);
            } else {
                console.error('Error fetching messages', data.message);
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            try {
                const response = await fetch('/api/message/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: newMessage,
                        chatId: selectedChatId,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    socket.emit('new message', data);
                    setMessages((prevMessages) => [...prevMessages, data]);
                    setFetchAgain(true);
                    setNewMessage('');
                } else {
                    console.error('Error sending message', data.message);
                }
            } catch (error) {
                console.error('Error sending message', error);
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

    const groupMessages = (messages) => {
        const grouped = [];
        let currentGroup = null;

        messages.forEach((message) => {
            const messageTime = new Date(message.createdAt).getTime();
            if (currentGroup && currentGroup.sender._id === message.sender._id) {
                const lastMessageTime = new Date(currentGroup.messages[currentGroup.messages.length - 1].createdAt).getTime();
                if (messageTime - lastMessageTime < 5 * 60 * 1000) {
                    currentGroup.messages.push(message);
                    currentGroup.lastTime = message.createdAt;
                } else {
                    grouped.push(currentGroup);
                    currentGroup = {
                        sender: message.sender,
                        messages: [message],
                        lastTime: message.createdAt,
                    };
                }
            } else {
                if (currentGroup) {
                    grouped.push(currentGroup);
                }
                currentGroup = {
                    sender: message.sender,
                    messages: [message],
                    lastTime: message.createdAt,
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
        <div className='flex m-1 flex-col justify-end bg-[#E8E8E8] sm:h-[75.2vh] h-[76.7vh] overflow-y-hidden'>
            {loading ? (
                <div className='flex justify-center items-center h-full'>
                    <h1 className='text-center text-3xl animate-pulse'>Loading .....</h1>
                </div>
            ) : (
                <div ref={historyRef} className='flex flex-col overflow-y-auto p-2' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {groupedMessages.map(group => (
                        <div key={`${group.sender._id}-${group.messages[0]._id}`} className={`flex flex-col items-${group.sender._id === currentUser._id ? 'end' : 'start'} my-1`}>
                            <div className="flex items-end">
                                {isGroupChat && group.sender._id !== currentUser._id && (
                                    <div className='w-10'>
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
                <button type="submit">
                    <IoSend className='w-6 h-6 ml-2 cursor-pointer' />
                </button>
            </form>
        </div>
    );
};

export default Chats;
