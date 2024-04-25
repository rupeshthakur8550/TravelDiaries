import React, { useEffect, useState } from 'react';
import { MdSearch } from "react-icons/md";
import { Avatar, Button, Modal, TextInput } from 'flowbite-react';
import { BsPlusCircleDotted } from "react-icons/bs";
import { useSelector } from 'react-redux';
import SearchResults from './SearchResults';
import { useChatState } from './Context/ChatProvider';
import useUserSearchAndSelect from './useUserSearchAndSelect'; // Import the custom hook

const MyChats = ({ fetchAgain }) => {
    const { currentUser } = useSelector(state => state.user);
    const { searchValue, setSearchValue, searchResults, loading, handleSearch, handleSelectUser, showResults, setShowResults, handleCancel } = useUserSearchAndSelect();
    const { setSelectedChat, selectedChat, chats, setChats } = useChatState();
    const [groupSearchValue, setGroupSearchValue] = useState('');
    const [groupSearchResults, setGroupSearchResults] = useState([]);
    const [groupLoading, setGroupLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showGroupChatResults, setShowGroupChatResults] = useState(false);

    const handleGroupChange = (e) => setGroupSearchValue(e.target.value);

    const handleGroupSearch = async () => {
        if (!groupSearchValue) {
            console.log("Please enter something in the group search");
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
        const fetchChats = async () => {
            try {
                const res = await fetch(`/api/chat/fetch`);
                if (!res.ok) throw new Error('Network response was not ok');
                const data = await res.json();
                setChats(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchChats();
    }, [fetchAgain]);

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

    return (
        <>
            <div className='md:w-[30%] w-[90%] border-4 border-green-300 rounded-lg relative'>
                <div className='flex justify-around items-baseline'>
                    <h1 className='text-center mt-2 font-semibold font-mono text-xl'>My Chats</h1>
                    <Button color='green' className='m-2 h-9' onClick={() => setShowModal(true)}>
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
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            className="border-b w-[100%] my-2"
                            style={{ height: "5vh", outline: "none" }}
                        />
                        {showResults && (
                            <SearchResults
                                results={searchResults}
                                handleSelectUser={handleSelectUser}
                                handleCancel={handleCancel}
                            />
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
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className='mb-5 text-lg text-gray-900 font-semibold'>- Create Group Chat -</h3>
                        <div className='mb-5 flex-col flex justify-center items-center gap-1'>
                            <TextInput
                                type='text'
                                id='groupname'
                                placeholder="Enter Group-Chat-Name"
                                size="small"
                                className='w-[80%]'
                            />
                            <div className='flex items-baseline gap-2'>
                                <div className='flex-col ml-4 w-[70%] relative'>
                                    <TextInput
                                        type="text"
                                        placeholder="Search Users.."
                                        icon={MdSearch}
                                        value={groupSearchValue}
                                        onChange={handleGroupChange}
                                        onFocus={() => setShowGroupChatResults(true)}
                                        className="border-b w-[100%] my-2"
                                        style={{ height: "5vh", outline: "none" }}
                                    />
                                    {showGroupChatResults && (
                                        <SearchResults
                                            results={groupSearchResults}
                                            handleSelectUser={handleSelectUser}
                                            handleCancel={() => setShowGroupChatResults(false)}
                                        />
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    className="mr-4 h-[5vh]"
                                    gradientDuoTone="greenToBlue"
                                    onClick={handleGroupSearch}
                                    disabled={groupLoading}
                                >
                                    {groupLoading ? 'Searching...' : 'Search'}
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                color='green'
                                gradientDuoTone="purpleToPink"
                                onClick={() => { setShowModal(false); }}
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
