import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat, setChats } from '../../redux/chat/chatSlice';;

const useUserSearchAndSelect = () => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async () => {
        if (!searchValue) {
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

            dispatch(setChats([data]));
            dispatch(setSelectedChat(data));
            setShowResults(false);
            setSearchValue('');
            setSearchResults([]);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCancel = () => {
        setShowResults(false);
        setSearchValue('');
        setSearchResults([]);
    };

    return { searchValue, setSearchValue, searchResults, loading, setSearchResults, handleSearch, handleSelectUser, showResults, setShowResults, handleCancel };
};

export default useUserSearchAndSelect;
