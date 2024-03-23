import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import OTP from '../models/otpVerification.model.js';
import nodemailer from 'nodemailer'

function generateOTP(length) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const sendMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingOTP = await OTP.findOne({ email });

        if (existingOTP) {
            const currentTime = new Date();
            if (existingOTP.expiry > currentTime) {
                return next(errorHandler(400, 'OTP is not expired, you can use the sent OTP.'));
            } else {
                return next(errorHandler(400, 'OTP has been expired, please click on resend.'));
            }
        }

        const otp = generateOTP(6);
        const hashedOTP = await bcryptjs.hash(otp, 10);

        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);

        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        // Email message
        let message = {
            from: process.env.USER,
            to: email,
            subject: 'TravelDiaries - Account Verification OTP',
            html: `
                <p>Dear Traveler,</p>
                <p>Welcome aboard TravelDiaries, your ultimate companion for documenting and sharing your breathtaking travel escapades!</p>
                <p>Your One-Time Password (OTP) for account verification:</p>
                <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
                    <h2 style="margin: 0; padding: 0; font-weight: bold; color: #333;">${otp}</h2>
                </div>
                <p>This OTP is your ticket to unlocking the full potential of TravelDiaries. Please ensure to use it within the next 10 minutes to verify your account.</p>
                <p>At TravelDiaries, we celebrate every journey, every moment of awe-inspiring beauty, and every story shared. Join our vibrant community of adventurers, nature enthusiasts, and passionate travelers.</p>
                <p>As you embark on this digital odyssey with TravelDiaries, may your adventures be boundless, your memories timeless, and your spirit forever wanderlust.</p>
                <p>Happy exploring!</p>
                <p>Warm regards,</p>
                <p>The TravelDiaries Team</p>
            `
        };

        await transport.sendMail(message);

        // Create OTP document
        await OTP.create({ email, otp: hashedOTP, expiry: expiryTime });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const existingOTP = await OTP.findOne({ email });

        if (!existingOTP) {
            return res.status(404).json({ success: false, message: 'No OTP found for the provided email.' });
        }

        const isMatch = await bcryptjs.compare(otp, existingOTP.otp);
        if (existingOTP.expiry > new Date() && isMatch) {
            return res.status(200).json({ success: true, message: 'OTP verified successfully.', id: existingOTP._id });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.'});
        }
    } catch (error) {
        next(error);
    }
};

export const resetOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const existingOTP = await OTP.findOne({ email });

        if (!existingOTP) {
            res.status(404).json({ success: false, message: 'No OTP found for the provided email.' });
            return;
        }
        const currentTime = new Date();

        if (existingOTP.expiry < currentTime) {
            const otp = generateOTP(6);
            const hashedOTP = await bcryptjs.hash(otp, 10);

            existingOTP.otp = hashedOTP;
            existingOTP.expiry = new Date();
            existingOTP.expiry.setMinutes(existingOTP.expiry.getMinutes() + 10);
            await existingOTP.save();

            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                }
            });

            let message = {
                from: process.env.USER,
                to: email,
                subject: 'TravelDiaries - Account Verification OTP',
                html: `
                    <p>Dear Traveler,</p>
                    <p>Welcome aboard TravelDiaries, your ultimate companion for documenting and sharing your breathtaking travel escapades!</p>
                    <p>Your One-Time Password (OTP) for account verification:</p>
                    <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
                        <h2 style="margin: 0; padding: 0; font-weight: bold; color: #333;">${otp}</h2>
                    </div>
                    <p>This OTP is your ticket to unlocking the full potential of TravelDiaries. Please ensure to use it within the next 10 minutes to verify your account.</p>
                    <p>At TravelDiaries, we celebrate every journey, every moment of awe-inspiring beauty, and every story shared. Join our vibrant community of adventurers, nature enthusiasts, and passionate travelers.</p>
                    <p>As you embark on this digital odyssey with TravelDiaries, may your adventures be boundless, your memories timeless, and your spirit forever wanderlust.</p>
                    <p>Happy exploring!</p>
                    <p>Warm regards,</p>
                    <p>The TravelDiaries Team</p>
                `
            };

            await transport.sendMail(message);

            res.status(200).json({ success: true, message: 'OTP has been reset and sent again.' });
        } else {
            return next(errorHandler(400, 'Cannot reset OTP as the previous OTP is not expired.'));
        }
    } catch (error) {
        next(error);
    }
};

export const deleteEntry = async(req, res, next) => {
    try {
        await OTP.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'deletion complete'});
    } catch (error) {
        next(error);
    }
}

