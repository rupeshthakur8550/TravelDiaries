import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password || !name || username === "" || email === "" || password === "" || name === "" ) {
        next(errorHandler(400, 'All Fileds are Required'));
    }
    const hashedpassword = bcryptjs.hashSync(password, 10);
    const newuser = new User({ username, email, password: hashedpassword, name, verification : "verified"});

    try {
        await newuser.save();
        res.json('SignUp Successfull');
    } catch (error) {
        next(error);
    }
}

export const signin = async(req, res, next) =>{
    const {username, password} = req.body;
    if (!username || !password || username === ""|| password === "") {
        next(errorHandler(400, 'All Fileds are Required'));
    }
    try {
        const validUser = await User.findOne({username});
        if(!validUser){
            return next(errorHandler(404, 'Wrong Credentials.. check username or password is correct or not'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(404, 'Wrong Credentials...  check username or password is correct or not'));
        }
        const token = jwt.sign({id: validUser._id, username: validUser.username},process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        res.status(200).cookie('access_token', token,{httpOnly: true}).json(rest);
    } catch (error) {
        next(error)
    }
}

export const googleAuth = async(req, res, next) => {
    const {email, name, googlePhotoUrl,} = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token,{httpOnly: true}).json(rest);
        }else{
            const generatedPasssword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPasssword, 10);
            const newUser = new User({
                username : name.split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                name,
                verification: 'Verified'
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token,{httpOnly: true}).json(rest);
        }
    } catch (error) {
        next(error);
    }
}

export const forgetPassword = async (req, res, next) => {
    const { email, cpassword, npassword } = req.body;
    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'User not found.'));
        }

        const validPassword = cpassword === npassword;
        if (!validPassword) {
            return next(errorHandler(400, 'Both Passwords need to be same'));
        }

        const hashedPassword = bcryptjs.hashSync(npassword, 10);
        validUser.password = hashedPassword;
        await validUser.save();
        res.json('Password reset successfully.');
        // res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        next(error);
    }
};
