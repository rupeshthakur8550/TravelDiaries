import { errorHandler } from "../utils/error.js";
import Chat from '../models/chat.model.js'
import User from '../models/user.model.js'

export const accessChat = async (req, res, next) => {
    const { userId } = req.body;
    const currentUser = req.user.id;

    if (!userId) {
        return next(errorHandler(400, 'UserId param not sent with request'));
    }

    try {
        // Find a chat where users exactly match the current user and the provided userId
        let isChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [currentUser, userId], $size: 2 } // Exactly two users
        })
            .populate({
                path: "users",
                select: "name username profilePicture"
            })
            .populate("latestMessage")
            .populate("latestMessage.sender", "name profilePicture email");

        if (isChat) {
            // If chat already exists, return it
            res.status(200).json(isChat);
        } else {
            // If chat doesn't exist, create a new one
            const chatData = {
                chatName: "conversation",
                isGroupChat: false,
                users: [currentUser, userId],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findById(createdChat._id)
                .populate({
                    path: "users",
                    select: "name username profilePicture"
                });
            res.status(200).json(fullChat);
        }
    } catch (error) {
        next(errorHandler(400, error.message));
    }
};

export const fetchChat = async (req, res, next) => {
    try {
        const chats = await Chat.find({ users: req.user.id })
            .populate({
                path: "users",
                select: "name profilePicture username bio",
            })
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name profilePicture username bio",
        });

        res.status(200).json(chats);
    } catch (error) {
        next(errorHandler(400, error.message));
    }
};

export const createGroupChat = async (req, res, next) => {
    try {
        if (!req.body.users || !req.body.name) {
            throw errorHandler(400, "Please fill all the fields");
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            throw errorHandler(400, "More than 2 users are required to form a group chat");
        }

        users = users.map(user => typeof user === 'object' ? user.id : user);
        users.push(req.user.id);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.id,
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
}

export const updateGroupChat = async (req, res, next) => {
    const { chatId, chatName, addUsers, removeUsers } = req.body;

    try {
        let updatedChat;

        // Update chat name if provided
        if (chatName) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { chatName: chatName },
                { new: true }
            );
        }

        // Add users if provided
        if (addUsers && addUsers.length > 0) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { $addToSet: { users: { $each: addUsers } } }, // Use $addToSet to avoid duplicates
                { new: true }
            );
        }

        // Remove users if provided
        if (removeUsers && removeUsers.length > 0) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { $pullAll: { users: removeUsers } }, // Use $pullAll to remove multiple users at once
                { new: true }
            );
        }

        if (!updatedChat) {
            console.log("Populated chat not found");
            return next(errorHandler(404, "Chat Not Found"));
        }

        // Send the updated chat as response
        res.json(updatedChat);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

