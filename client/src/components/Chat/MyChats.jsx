import React, { useEffect, useState, useMemo } from 'react';
import { MdSearch } from "react-icons/md";
import { Avatar, Button, Modal, TextInput } from 'flowbite-react';
import { MdPersonRemove, MdPersonAdd } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import SearchResults from './SearchResults';
import { setChats, setSelectedChat } from '../../redux/chat/chatSlice';
import useUserSearchAndSelect from './useUserSearchAndSelect';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { searchValue, setSearchValue, searchResults, loading, handleSearch, handleSelectUser, showResults, setShowResults, handleCancel } = useUserSearchAndSelect();
    const selectedChat = useSelector((state) => state.chat.selectedChat);
    const chats = useSelector((state) => state.chat.chats);

    const [groupSearchValue, setGroupSearchValue] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupSearchResults, setGroupSearchResults] = useState([]);
    const [groupLoading, setGroupLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showGroupChatResults, setShowGroupChatResults] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch(`/api/chat/fetch`, {
                    method: 'GET',
                });
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                dispatch(setChats(data)); // Update Redux state with fetched chats
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchChats();
    }, [fetchAgain, dispatch]);

    const handleGroupSearch = async () => {
        if (!groupSearchValue) {
            return;
        }

        try {
            setGroupLoading(true);
            const res = await fetch(`/api/user/search_user?search=${groupSearchValue}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setGroupSearchResults(data);
            setShowGroupChatResults(true);
        } catch (error) {
            console.error('Error fetching group data:', error);
        } finally {
            setGroupLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
            handleGroupSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue, groupSearchValue, handleSearch, handleGroupSearch]);

    // Memoize the getSender function
    const getSender = useMemo(() => {
        return (loggedUser, users) => {
            if (users && users.length > 0) {
                const sender = users.find(user => user._id !== loggedUser._id);
                return (
                    <div className="flex items-center h-10 px-3">
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
    }, []);

    // Memoize the handleGroup function
    const handleGroup = useMemo(() => {
        return (userToAdd) => {
            if (selectedUsers.some(user => user._id === userToAdd._id)) {
                return;
            }
            setGroupSearchResults([]);
            setGroupSearchValue('');
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userToAdd]);
        };
    }, [selectedUsers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName || selectedUsers.length === 0) {
            console.error('Group name or selected users missing');
            return;
        }

        try {
            const res = await fetch('/api/chat/group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: groupName,
                    users: selectedUsers.map(user => user._id)
                })
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            dispatch(setChats([data, ...chats]));
            setSelectedUsers([]);
            setGroupName('');
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChatClick = (chat) => {
        if (selectedChat && selectedChat._id === chat._id) {
            dispatch(setSelectedChat(null)); // Deselect chat if already selected
        } else {
            dispatch(setSelectedChat(chat)); // Select the chat for conversation
        }
    };

    return (
        <>
            <div className={`md:w-[50vw] lg:w-[30vw] w-[90%] border-4 border-green-300 rounded-lg relative ${selectedChat ? 'hidden' : ''} md:block`}>
                <div className='flex justify-around items-baseline'>
                    <h1 className='text-center mt-2 font-semibold font-mono text-xl'>My Chats</h1>
                    <Button color='green' className='m-2 h-9' onClick={() => setShowModal(true)}>
                        New Group Chat
                        <MdPersonAdd className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                <hr className="border-t-2 border-gray-300" />
                <div className='flex items-baseline gap-2'>
                    <div className='flex-col mx-4 w-[100%] relative'>
                        <TextInput
                            type="text"
                            placeholder="Search Users.."
                            icon={MdSearch}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            className="border-b w-[100%] my-2"
                            style={{ height: "5vh", outline: "none" }}
                        />
                    </div>
                </div>
                {showResults && (
                    <SearchResults
                        results={searchResults}
                        handleSelectUser={handleSelectUser}
                        handleCancel={handleCancel}
                    />
                )}
                <hr className="border-t-2 border-gray-300" />
                <div className='relative z-0 flex flex-col overflow-y-auto p-2 h-96' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {chats && chats.length > 0 ? (
                        <div>
                            {chats.map((chat) => (
                                <div
                                    onClick={() => handleChatClick(chat)} // Modify click handler to toggle selectedChat
                                    className={`cursor-pointer ${selectedChat === chat ? 'bg-lime-400 bg-opacity-40 rounded-md backdrop-filter backdrop-blur-lg' : ''}`}
                                    key={chat._id}
                                >
                                    <div className='m-2'>
                                        {!chat.isGroupChat ? (
                                            getSender(currentUser, chat.users)
                                        ) : (
                                            <div className="flex items-center px-3 py-2">
                                                <Avatar
                                                    alt={chat.chatName}
                                                    img="https://cdn-icons-png.flaticon.com/512/681/681494.png"
                                                    rounded
                                                    className="w-10 h-7 mr-2"
                                                />
                                                <span>{chat.chatName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex justify-center items-center h-full'>
                            <h1 className='text-center text-3xl animate-pulse'>No Chats Available...</h1>
                        </div>
                    )}
                </div>
            </div>
            <Modal show={showModal} onClose={() => {
                setShowGroupChatResults(false);
                setShowModal(false);
                setGroupSearchResults([]);
                setGroupSearchValue('');
            }} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center space-y-6">
                        <h3 className='mb-5 text-lg text-gray-900 font-semibold'>Create Group Chat</h3>
                        <div className='mb-5 flex-col flex justify-center items-center gap-1'>
                            <TextInput
                                type='text'
                                id='groupname'
                                placeholder="Enter Group-Chat-Name"
                                size="small"
                                onChange={(e) => setGroupName(e.target.value)}
                                className='w-[100%]'
                            />
                            <div className='flex flex-col items-baseline w-[100%] h-auto'>
                                <div className='flex flex-row items-center relative w-[100%] gap-3'>
                                    <TextInput
                                        type="text"
                                        placeholder="Search Users.."
                                        icon={MdSearch}
                                        value={groupSearchValue}
                                        onChange={(e) => setGroupSearchValue(e.target.value)}
                                        onFocus={() => setShowGroupChatResults(true)}
                                        className="border-b my-2 w-[100%]"
                                        style={{ height: "6vh", outline: "none" }}
                                    />
                                </div>
                                <div className='w-[100%] mt-2 relative h-auto'>
                                    {selectedUsers.length > 0 && (
                                        <ul className="flex flex-col gap-1 my-2 w-[100%]">
                                            {selectedUsers.slice(0, 4).map((result) => (
                                                <li key={result._id} className="flex items-center justify-between cursor-pointer bg-purple-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg" onClick={() => { handleGroup(result) }}>
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            alt='user'
                                                            img={result.profilePicture}
                                                            rounded
                                                            className="w-10 h-6 mr-2"
                                                        />
                                                        <span>{result.username}</span>
                                                    </div>
                                                    <span className='mr-3' onClick={() => {
                                                        setSelectedUsers(prevUsers => prevUsers.filter(user => user._id !== result._id))
                                                    }}>{<MdPersonRemove className="ml-2 h-5 w-5" />}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className='relative w-[100%] mt-3'>
                                    {showGroupChatResults && (
                                        <div className='flex flex-col items-center w-[100%]'>
                                            {groupSearchResults.length > 0 ? (
                                                <ul className="flex flex-col gap-1 my-2 w-[90%]">
                                                    {groupSearchResults.slice(0, 4).map((result) => (
                                                        <li key={result._id} className="flex items-center cursor-pointer bg-gray-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg" onClick={() => handleGroup(result)}>
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
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                color='green'
                                gradientDuoTone="purpleToPink"
                                onClick={(e) => {
                                    handleSubmit(e)
                                }}
                                outline
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MyChats;
