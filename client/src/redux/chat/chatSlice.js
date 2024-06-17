// src/store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        selectedChat: null,
        notification: [],
        chats: [],
    },
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        addNotification: (state, action) => {
            state.notification.push(action.payload);
        },
        addChat: (state, action) => {
            state.chats.push(action.payload);
        },
    },
});

export const { setSelectedChat, setNotification, setChats, addNotification, addChat } = chatSlice.actions;

export default chatSlice.reducer;
