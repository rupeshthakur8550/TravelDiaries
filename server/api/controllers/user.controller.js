import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { sendEmail } from './otp.controller.js'
import Query from '../models/queries.model.js';

export const test = (req, res) => {
    res.json({ message: 'API is working' });
};

export const updateUser = async (req, res, next) => {
    try {
        const { password, username, name, mobileNo, dateOfBirth, bio } = req.body;

        if (req.user.id != req.params.userId) {
            return next(errorHandler(400, 'You are not allowed to update this user'));
        }

        if (password) {
            if (password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters'))
            }
            password = bcryptjs.hashSync(password, 10);
        }

        if (name && name.trim() === "") {
            return next(errorHandler(400, 'Name should be filled'));
        }

        if (username) {
            if (await User.findOne({ username })) {
                return next(errorHandler(400, 'Username already exists, try a different username'));
            }
            if (username.length < 7 || username.length > 20) {
                return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
            }
            if (username.includes(' ')) {
                return next(errorHandler(400, 'Username cannot contain spaces'));
            }
            if (username !== username.toLowerCase()) {
                return next(errorHandler(400, 'Username must be lowercase'));
            }
            if (!username.match(/^[a-zA-Z0-9-_@#$^*]+$/)) {
                return next(errorHandler(400, 'Username can only contain letters and numbers'));
            }
        }

        if (mobileNo) {
            if (mobileNo.length < 14 || mobileNo.length > 15) {
                return next(errorHandler(400, 'Enter Valid Mobile Number'));
            }
        }

        if (dateOfBirth) {
            if (dateOfBirth === null || dateOfBirth === undefined) {
                return next(errorHandler(400, 'Enter Valid Date of Birth'));
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password,
                name,
                bio,
                mobileNo,
                dateOfBirth,
                verification: "verified",
                profile_complete_status: dateOfBirth && mobileNo && bio ? true : false
            },
        }, { new: true });

        const { password: removedPassword, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
};

export const verify = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!await User.findOne({ username })) {
            return res.status(400).json({ error: 'User not exists' });
        } else {
            res.status(200).json('User found');
        }

    } catch (error) {
        next(error);
    }
}

export const getUsername = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        } else {
            const subject = 'TravelDiaries - Your Username';
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; text-align: center;">TravelDiaries</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #666;">Dear Traveler,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #666;">It seems you've forgotten your username. No worries, we've got you covered!</p>
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h2 style="margin: 0; padding: 0; font-weight: bold; color: #333;">${user.username}</h2>
                </div>
                <p style="font-size: 16px; line-height: 1.5; color: #666;">You can now continue exploring with TravelDiaries. If you have any other issues, feel free to reach out to us.</p>
                <p style="font-size: 16px; line-height: 1.5; color: #666;">Warm regards,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #666;"><strong>The TravelDiaries Team</strong></p>
                </div>
            `;

            if (await sendEmail(subject, email, htmlContent)) {
                res.status(200).json({ success: true, message: 'Username has been sent to your email.' });
            }
        }
    } catch (error) {
        next(error);
    }
}

export const queries = async (req, res, next) => {
    const { name, email, message } = req.body;
    if (!email || !message || !name || email === "" || message === "" || name === "") {
        next(errorHandler(400, 'All Fileds are Required'));
    }
    const newquery = new Query({ name, email, message });
    try {
        await newquery.save();
        res.status(200).json({ success: true, message: 'Message Added' });
    } catch (error) {
        next(error);
    }
};

export const allUsers = async (req, res, next) => {
    const searchQuery = req.query.search; // Extract search query from query parameters
    const keyword = searchQuery ? {
        $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
        ],
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
    res.send(users);
}


