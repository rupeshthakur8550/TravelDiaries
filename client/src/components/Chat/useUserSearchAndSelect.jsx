import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat, setChats } from '../../redux/chat/chatSlice';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_ENDPOINT_SOCKET;
let socket;

const useUserSearchAndSelect = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!socket) {
            socket = io(ENDPOINT);

            socket.on('connect', () => {
                socket.emit('setup', currentUser);
            });

            socket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            socket.on('chat created', (newChat) => {
                dispatch(setChats((prevChats) => {
                    return Array.isArray(prevChats) ? [...prevChats, newChat] : [newChat];
                }));
            });
        }

        // Clean up the socket connection on component unmount
        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [currentUser, dispatch]);

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
            setShowResults(false);
            setSearchValue('');
            setSearchResults([]);
            socket.emit('new chat', data);
            dispatch(setChats((prevChats) => [data, ...prevChats]));
            dispatch(setSelectedChat(data));
        } catch (error) {
            console.error('Error selecting user:', error);
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
