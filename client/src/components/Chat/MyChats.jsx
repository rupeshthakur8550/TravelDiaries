import { Avatar, Button, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { MdSearch, MdCancel } from "react-icons/md";
import { useChatState } from './Context/ChatProvider';

const MyChats = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { setSelectedChat, chats, setChats } = useChatState();

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
            setSelectedChat(data);
            setLoadingChat(false);
            setShowResults(false);

        } catch (error) {
            console.log(error.message);
        }
    }

    const handleCancel = () => {
        setShowResults(false);
        setSearchResults([]);
    };

    return (
        <div className='md:w-[30%] w-[90%] border-4 border-green-300 rounded-lg'>
            <div className='flex items-baseline gap-2'>
                <div className='flex-col ml-4 w-[70%]'>
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
                        <div className='my-1 absolute md:w-[18%] w-[63%] bg-white shadow-md rounded px-4 py-2 max-h-96 overflow-y-auto'>
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
                                        <li key={result._id} className="flex items-center cursor-pointer bg-gray-200 hover:bg-blue-300 text-black px-3 py-2 mb-2 rounded-lg" onClick={() => handleSelectUser(result._id)}>
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
        </div>
    );
}

export default MyChats;
