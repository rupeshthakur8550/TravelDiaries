import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdArrowBack } from "react-icons/io";
import { MdPersonRemove, MdSearch } from "react-icons/md";
import { Avatar, Button, Modal, TextInput } from 'flowbite-react';
import { setSelectedChat } from '../../redux/chat/chatSlice';
import useUserSearchAndSelect from './useUserSearchAndSelect';
import Chats from './Chats';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_ENDPOINT_SOCKET;
let socket;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const selectedChat = useSelector((state) => state.chat.selectedChat);
    const [showProfileModel, setShowProfileModel] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [formData, setFormData] = useState({ groupname: '', users: [] });

    const {
        searchValue,
        setSearchValue,
        setSearchResults,
        searchResults,
        handleSearch,
        showResults,
        handleCancel,
        setShowResults,
    } = useUserSearchAndSelect();

    useEffect(() => {
        if (selectedChat && selectedChat.isGroupChat) {
            setSelectedUsers(selectedChat.users);
            setFormData({ groupname: selectedChat.chatName || '', users: selectedChat.users });
        } else {
            setFormData({ groupname: '', users: [] });
        }
    }, [selectedChat, fetchAgain]);

    useEffect(() => {
        if (!socket) {
            socket = io(ENDPOINT);
            socket.on('connection');
            socket.emit('setup', currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!socket.connected) {
            socket = io(ENDPOINT);
            socket.on('connection', () => console.log("socket connected"));
            socket.emit('setup', currentUser);
        }

        if (socket) {
            socket.on('chat deleted', (deletedChatId) => {
                if (selectedChat && selectedChat._id === deletedChatId) {
                    dispatch(setSelectedChat(null));
                    setFetchAgain(prev => !prev);
                }
            });

            socket.on('user left group', (groupId) => {
                if (selectedChat && selectedChat._id === groupId) {
                    dispatch(setSelectedChat(null));
                    setFetchAgain(prev => !prev);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('chat deleted');
                socket.off('user left group');
                socket.disconnect();
            }
        };
    }, [selectedChat, dispatch, setFetchAgain]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const handleBack = () => {
        dispatch(setSelectedChat(null));
    };

    const handleShowProfile = () => {
        setShowProfileModel(true);
    };

    const handleRemoveUser = (userId) => {
        const updatedUsers = selectedUsers.filter(user => user._id !== userId);
        setSelectedUsers(updatedUsers);
    };

    const handleAddUser = (userToAdd) => {
        if (selectedUsers.some(user => user._id === userToAdd._id)) {
            return;
        }
        const updatedUsers = [...selectedUsers, userToAdd];
        setSelectedUsers(updatedUsers);
        setSearchValue('');
        setShowResults(false);
        setSearchResults([]);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/chat/updategroupchat', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: selectedChat._id,
                    chatName: formData.groupname,
                    addUsers: selectedUsers.filter(user => !selectedChat.users.some(u => u._id === user._id)),
                    removeUsers: selectedChat.users.filter(user => !selectedUsers.some(u => u._id === user._id))
                }),
            });
            const data = await response.json();
            if (response.ok) {
                dispatch(setSelectedChat(data));
                setShowProfileModel(false);
                setFetchAgain(prev => !prev);
            } else {
                console.error('Error updating group:', data.message);
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDelete = async (chatId) => {
        try {
            const res = await fetch(`/api/chat/deletechat/${chatId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                const chatUsers = selectedChat.users.map(user => user._id);
                socket.emit('chat deleted', chatId, chatUsers);
                dispatch(setSelectedChat(null));
                setFetchAgain(prev => !prev);
                setShowProfileModel(false);
            } else {
                const errorData = await res.json();
                console.error('Error deleting group:', errorData);
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleLeaveGroup = async (chatId) => {
        try {
            const res = await fetch(`/api/chat/leavegroupchat/${chatId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id })
            });
            if (res.ok) {
                socket.emit('user left group', chatId, currentUser._id);
                setSelectedChat(null);
                setFetchAgain(prev => !prev);
                setShowProfileModel(false);
            } else {
                const errorData = await res.json();
                console.error('Error leaving group:', errorData);
            }
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const getOtherUser = (chat) => {
        return chat.users.find(user => user._id !== currentUser._id);
    };

    const otherUser = selectedChat && !selectedChat.isGroupChat ? getOtherUser(selectedChat) : null;

    return (
        <div className={`md:w-[50%] lg:w-[70%] w-[90%] border-4 border-green-300 rounded-lg relative ${selectedChat ? 'block' : 'hidden'} md:block`}>
            {!selectedChat ? (
                <>
                    <h1 className='text-center mt-3 font-semibold font-mono text-xl my-3'>ChatBox</h1>
                    <hr className="mt-3 border-t-2 border-gray-300" />
                    <div className='flex justify-center items-center h-[95%]'>
                        <div className="text-gray-500 text-center">
                            <p className="mb-4 font-semibold text-base">Select a user to start chatting!</p>
                            <img src="https://cdn-icons-png.flaticon.com/512/4470/4470335.png" alt="Select User Illustration" className="mx-auto w-1/2" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-row justify-between items-center mx-3 my-[2px]'>
                        <IoMdArrowBack className='w-10 h-5 block md:hidden' onClick={handleBack} />
                        <h1 className='flex-grow text-center justify-center text-lg cursor-pointer' style={{ fontVariant: 'unicase' }} onClick={handleShowProfile}>
                            <div className="flex justify-center items-center gap-3 my-1">
                                <Avatar
                                    alt={selectedChat.isGroupChat ? selectedChat.chatName : otherUser.username}
                                    img={selectedChat.isGroupChat ? "https://cdn-icons-png.flaticon.com/512/681/681494.png" : otherUser.profilePicture}
                                    rounded
                                    className="w-10 h-10"
                                />
                                <span>{selectedChat.isGroupChat ? selectedChat.chatName : otherUser.username}</span>
                            </div>
                        </h1>
                        <div className='w-10 h-5 block md:hidden' />
                    </div>
                    <hr className="mb-1 border-t-2 border-gray-300" />
                    <Chats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} selectedChatId={selectedChat._id} isGroupChat={selectedChat.isGroupChat} />
                </>
            )}
            <Modal show={showProfileModel} onClose={() => {
                setShowProfileModel(false);
                handleCancel();
            }} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    {selectedChat && !selectedChat.isGroupChat ? (
                        <div className="flex flex-col justify-center items-center gap-2">
                            <img src={otherUser.profilePicture} alt='user' className='rounded-full w-20 h-20 object-cover' />
                            <h1 className='text-2xl font-semibold ml-3'>{otherUser.name}</h1>
                            <h1 className='text-xs font-semibold ml-3'>@{otherUser.username}</h1>
                            <h1 className='text-md font-semibold ml-3'>{otherUser.bio}</h1>
                            <Button color='red' className='border-b w-[70%] mt-5' onClick={() => handleDelete(selectedChat._id)}>Delete Chat</Button>
                        </div>
                    ) : (
                        selectedChat && selectedChat.isGroupChat &&
                        <div className="flex flex-col justify-center items-center gap-2">
                            <img src="https://cdn-icons-png.flaticon.com/512/681/681494.png" alt='group' className='rounded-full w-20 h-20 object-cover' />
                            <h1 className='text-2xl font-semibold ml-3'>{selectedChat.chatName}</h1>
                            <h1 className='text-md font-semibold ml-3'>Admin: {selectedChat.groupAdmin.name}</h1>
                            <h1 className='text-md font-semibold ml-3'>Members:</h1>
                            {selectedChat.groupAdmin._id === currentUser._id ? (
                                <>
                                    <ul className="flex flex-col gap-1 w-[100%]">
                                        {selectedUsers
                                            .filter(member => member.username !== selectedChat.groupAdmin.username)
                                            .map(member => (
                                                <li key={member._id} className="flex justify-between bg-purple-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg gap-1 items-center w-[100%]">
                                                    <div className='flex gap-3'>
                                                        <Avatar
                                                            alt={member.username}
                                                            img={member.profilePicture}
                                                            rounded
                                                            className="w-10 h-7"
                                                        />
                                                        <span>{member.username}</span>
                                                    </div>
                                                    <MdPersonRemove className="mr-2 h-5 w-5 cursor-pointer" onClick={() => handleRemoveUser(member._id)} />
                                                </li>
                                            ))}
                                    </ul>
                                    <TextInput
                                        id='groupname'
                                        type="text"
                                        onChange={handleChange}
                                        className="border-b w-[100%]"
                                        placeholder='Group Name'
                                        value={formData.groupname}
                                    />
                                    <div className='relative flex items-center w-[100%]'>
                                        <MdSearch className="absolute ml-2 h-5 w-5 cursor-pointer" onClick={handleSearch} />
                                        <TextInput
                                            type="text"
                                            placeholder="Search Users.."
                                            icon={MdSearch}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            onFocus={() => setShowResults(true)}
                                            className="border-b my-2 w-[100%]"
                                            style={{ height: "6vh", outline: "none" }}
                                        />
                                        {showResults && searchResults.length > 0 && (
                                            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                                                <ul className="max-h-40 overflow-y-auto">
                                                    {searchResults.map((result) => (
                                                        <li key={result._id} className="flex items-center cursor-pointer bg-gray-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg" onClick={() => handleAddUser(result)}>
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
                                            </div>
                                        )}
                                    </div>
                                </>) : (
                                <ul className="flex flex-col gap-1 w-[100%]">
                                    {selectedUsers
                                        .filter(member => member.username !== selectedChat.groupAdmin.username)
                                        .map(member => (
                                            <li key={member._id} className="flex justify-between bg-purple-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg gap-1 items-center w-[100%]">
                                                <div className='flex gap-3'>
                                                    <Avatar
                                                        alt={member.username}
                                                        img={member.profilePicture}
                                                        rounded
                                                        className="w-10 h-7"
                                                    />
                                                    <span>{member.username}</span>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            )}
                            < div className='flex justify-center flex-col gap-2'>
                                {
                                    (selectedChat.groupAdmin._id === currentUser._id) ? (
                                        <>
                                            <Button color='green' className='border-b w-[100%]' onClick={handleSubmit}>Update Group</Button>
                                            <Button color='red' className='border-b w-[100%]' onClick={() => handleDelete(selectedChat._id)}>Delete Group</Button>
                                        </>
                                    ) : (
                                        <Button color='red' className='border-b w-[100%]' onClick={() => handleLeaveGroup(selectedChat._id)}>Leave Group</Button>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default ChatBox;
