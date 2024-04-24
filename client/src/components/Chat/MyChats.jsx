import { Avatar, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { MdSearch, MdCancel } from "react-icons/md";
import { useChatState } from './Context/ChatProvider';
import { Stack } from '@mui/material'
import { BsPlusCircleDotted } from "react-icons/bs";
import { useSelector } from 'react-redux';

const MyChats = ({ fetchAgain }) => {
    const { currentUser } = useSelector(state => state.user);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { setSelectedChat, selectedChat, chats, setChats } = useChatState();

    const handleSearch = async () => {
        if (!searchValue) {
            console.log("Please enter something in the search");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/user/search_user?search=${searchValue}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            if (chats && !chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Provide user feedback
            // Possibly set an error state
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSelectUser = async (userId) => {
        try {
            setLoadingChat(true);

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            // Update the state of chats to include the newly selected user
            setChats(prevChats => [data, ...prevChats]);

            setSelectedChat(data);
            setLoadingChat(false);
            setShowResults(false);

        } catch (error) {
            console.log(error.message);
            // Provide user feedback
            // Possibly set an error state
        }
    }


    const getSender = (loggedUser, users) => {
        if (users && users.length > 0) {
            const sender = users[0]._id === loggedUser?._id ? users[1] : users[0];
            return (
                <div className="flex items-center h-10 pb-3 px-3">
                    <Avatar
                        alt={sender.username}
                        img={sender.profilePicture}
                        rounded
                        className="w-10 h-7 mr-2"
                    />
                    <span className='text-semibold'>{sender.username}</span>
                </div>
            );
        } else {
            return null;
        }
    };

    const fetchChats = async () => {
        try {
            const res = await fetch(`/api/chat/fetch`, {
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setChats(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [fetchAgain]);

    const handleCancel = () => {
        setShowResults(false);
        setSearchResults([]);
    };

    return (
        <div className='md:w-[30%] w-[90%] border-4 border-green-300 rounded-lg relative'>
            <div className='flex justify-around items-baseline'>
                <h1 className='text-center mt-2 font-semibold font-mono text-xl'>My Chats</h1>
                <Button color='green' className='m-2 h-9'>
                    New Group Chat
                    <BsPlusCircleDotted className="ml-2 h-5 w-5" />
                </Button>
            </div>
            <hr className="border-t-2 border-gray-300" />
            <div className='flex items-baseline gap-2'>
                <div className='flex-col ml-4 w-[70%] relative'>

                    <TextInput
                        type="text"
                        placeholder="Search Users.."
                        icon={MdSearch}
                        value={searchValue}
                        onChange={handleChange}
                        onFocus={() => setShowResults(true)}
                        className="border-b w-[100%] my-2"
                        style={{ height: "5vh", outline: "none" }}
                    />
                    {showResults && (
                        <div className='my-1 absolute w-[100%] bg-white shadow-md rounded px-4 py-2 max-h-96 overflow-y-auto z-10'>
                            <div className='flex justify-between items-center'>
                                <h1 className={`text-sm font-medium truncate lg:block py-1 pr-4 pl-3`} style={{ fontVariant: "petite-caps" }}>
                                    Search Results :
                                </h1>
                                <button onClick={handleCancel}><MdCancel className='w-5 h-5' /></button>
                            </div>
                            <hr className="my-2 border-t-2 border-gray-300" />
                            {searchResults.length > 0 ? (
                                <ul className="flex flex-col gap-1 my-2">
                                    {searchResults.map((result) => (
                                        <li key={result._id} className="flex items-center cursor-pointer bg-gray-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg" onClick={() => handleSelectUser(result._id)}>
                                            <Avatar
                                                alt='user'
                                                img={result.profilePicture}
                                                rounded
                                                className="w-10 h-6 mr-2"
                                            />
                                            <span>{result.username}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="flex flex-col gap-4">
                                    <li className="flex items-center">
                                        <span> No User Found </span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}

                </div>

                <Button
                    type="button"
                    className="mr-4 h-[5vh]"
                    gradientDuoTone="greenToBlue"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </div>
            <hr className="border-t-2 border-gray-300" />
            <div className="relative z-0" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                {chats ? (
                    <div className='mt-4'>
                        {chats.map((chat) => (
                            <div
                                onClick={() => setSelectedChat(chat)}
                                className={`cursor-pointer ${selectedChat === chat ? 'bg-lime-400 bg-opacity-40 rounded-md backdrop-filter backdrop-blur-lg' : ''
                                    }`}
                                key={chat._id}
                            >
                                <div className='m-2'>
                                    {!chat.isGroupChat
                                        ? getSender(currentUser, chat.users)
                                        : chat.chatName}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ChatLoading />
                )}
            </div>

        </div>

    );
}

export default MyChats;
