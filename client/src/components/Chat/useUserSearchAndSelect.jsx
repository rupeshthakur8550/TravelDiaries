// useUserSearchAndSelect.js
import { useState } from 'react';
import { useChatState } from "./Context/ChatProvider";

const useUserSearchAndSelect = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { setSelectedChat, setChats } = useChatState();

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
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = async (userId) => {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();

            setChats(prevChats => [data, ...prevChats]);
            setSelectedChat(data);
            setShowResults(false);

        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCancel = () => {
        setShowResults(false);
        setSearchResults([]);
    };

    return { searchValue, setSearchValue, searchResults, loading, handleSearch, handleSelectUser, showResults, setShowResults, handleCancel };
};

export default useUserSearchAndSelect;
