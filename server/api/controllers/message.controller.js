import crypto from 'crypto';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Chat from '../models/chat.model.js';

const algorithm = 'aes-256-cbc';
const encryptionKey = crypto.scryptSync(`${process.env.ENCRYPTION_KEY}`, 'salt', 32); // 256-bit key

if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set.');
}

// Function to encrypt the message content
export const encryptMessage = (content) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        content: encrypted
    };
};

// Function to decrypt the message content
export const decryptMessage = (message) => {
    if (!message || typeof message.content !== 'string' || typeof message.iv !== 'string') {
        throw new Error('Invalid message format. Expected properties: content, iv.');
    }

    try {
        const iv = Buffer.from(message.iv, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
        let decrypted = decipher.update(message.content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error(`Decryption failed for message with id ${message._id}:`, error);
        throw new Error('Decryption failed.');
    }
};

export const sendMessage = async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        // Encrypt the message content
        const encryptedMessage = encryptMessage(content);

        let message = await Message.create({
            sender: req.user.id,
            content: encryptedMessage.content,
            iv: encryptedMessage.iv,
            chat: chatId,
        });

        message = await message.populate("sender", "name username profilePicture email");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name username profilePicture email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        // Decrypt message content for sending back in response
        const decryptedMessageContent = decryptMessage(message);
        const decryptedMessage = {
            ...message.toObject(),
            content: decryptedMessageContent
        };
        res.json(decryptedMessage);
    } catch (error) {
        next(error);
    }
};

export const allMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name username profilePicture email")
            .populate("chat");

        // Decrypt each message content
        const decryptedMessages = messages.map(message => {
            try {
                return {
                    ...message.toObject(),
                    content: decryptMessage(message)
                };
            } catch (error) {
                console.error(`Failed to decrypt message with id ${message._id}:`, error);
                return message;
            }
        });

        res.json(decryptedMessages);
    } catch (error) {
        next(error);
    }
};
