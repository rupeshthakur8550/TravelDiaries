import { errorHandler } from "../utils/error.js";
import Chat from '../models/chat.model.js'
import Message from '../models/message.model.js';
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
        const { users, name } = req.body;

        if (!users || !name) {
            return next(errorHandler(400, "Please fill all the fields"));
        }

        let parsedUsers;

        try {
            parsedUsers = Array.isArray(users) ? users : JSON.parse(users);
        } catch (error) {
            return next(errorHandler(400, "Invalid users format"));
        }

        if (parsedUsers.length < 2) {
            return next(errorHandler(400, "More than 2 users are required to form a group chat"));
        }

        const userIds = parsedUsers.map(user => typeof user === 'object' ? user.id : user);
        userIds.push(req.user.id);

        const groupChat = await Chat.create({
            chatName: name,
            users: userIds,
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

        if (chatName) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { chatName: chatName },
                { new: true }
            );
        }

        if (addUsers && addUsers.length > 0) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { $addToSet: { users: { $each: addUsers } } },
                { new: true }
            );
        }

        if (removeUsers && removeUsers.length > 0) {
            updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { $pullAll: { users: removeUsers } },
                { new: true }
            );
        }

        if (!updatedChat) {
            console.log("Populated chat not found");
            return next(errorHandler(404, "Chat Not Found"));
        }

        const users = await User.find({ _id: { $in: updatedChat.users } }).select('username name profilePicture');
        const groupAdmin = await User.findById(updatedChat.groupAdmin).select('username name profilePicture');

        res.json({
            ...updatedChat.toObject(),
            users,
            groupAdmin
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const deleteChat = async (req, res, next) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.chatId);
        const messages = await Message.deleteMany({ chat: req.params.chatId });
        res.status(200).json('Group chat and all associated messages have been deleted');
    } catch (error) {
        next(error);
    }
}

export const leaveGroupChat = async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return next(errorHandler(400, 'UserId param not sent with request'));
    }

    try {
        // Find the group by ID
        const group = await Chat.findById(req.params.chatId);

        if (!group) {
            return next(errorHandler(404, 'Group not found'));
        }

        // Check if the user is part of the group
        const isMember = group.users.includes(userId);

        if (!isMember) {
            return next(errorHandler(400, 'User is not a member of this group'));
        }

        // Remove the user from the group members array
        group.users = group.users.filter(memberId => memberId.toString() !== userId);
        await group.save();

        // Delete all messages sent by the user in this group
        await Message.deleteMany({ sender: userId, chat: req.params.chatId });

        res.status(200).json({ message: 'User has been removed from the group and their messages have been deleted' });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};


