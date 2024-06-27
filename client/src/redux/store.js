import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice';
import chatReducer from './chat/chatSlice';
import appReducer from './app/appSlice'

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    app: appReducer
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    whitelist: ['user', 'chat', 'app'],  // Add the slices you want to persist
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Configure persistor
export const persistor = persistStore(store);
