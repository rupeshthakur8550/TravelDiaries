import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({ message: 'API is working' });
};

export const updateUser = async (req, res, next) => {
    try {
        let { password, username, name, mobileNo, dateOfBirth } = req.body;

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

        if(dateOfBirth){
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
                mobileNo,
                dateOfBirth,
                verification: "verified"
            },
        },
            { new: true });

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

export const verify =async (req, res, next)=>{
    try{
        const {email} = req.body;
        if (!await User.findOne({ email })) {
            return res.status(400).json({ error: 'User not exists' });
        }else{
            res.status(200).json('User found');
        }

    }catch(error){
        next(error);
    }
}
