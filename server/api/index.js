import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import otpRoutes from './routes/otp.route.js';
import messageRoutes from './routes/message.route.js';
import postRoutes from './routes/posts.route.js'
import chatRoutes from './routes/chat.route.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO)
    .then(() => console.log('MongoDB is connected'))
    .catch((err) => console.log(err));

const server = app.listen(4000, () => {
    console.log("Server is running on port 4000");
});

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
    })

    socket.on('new message', async (newMessage) => {
        var chat = newMessage.chat;
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(async (user) => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit('message received', newMessage);
        });
    });
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/post', postRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});