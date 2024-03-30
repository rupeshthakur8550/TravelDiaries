import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import OTP from '../models/otpVerification.model.js';
import nodemailer from 'nodemailer'

const generateOTP = (length) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const sendEmail = async (subject, email, htmlContent) => {
    try {
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
            subject: subject,
            html: htmlContent
        };

        await transport.sendMail(message);
        return true;
    } catch (error) {
        return false;
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const existingOTP = await OTP.findOne({ email });

        if (!existingOTP) {
            return next(errorHandler(404, 'No OTP found for the provided email.'));
            // return res.status(404).json({ success: false, message: 'No OTP found for the provided email.' });
        }

        const isMatch = await bcryptjs.compare(otp, existingOTP.otp);
        if (existingOTP.expiry > new Date() && isMatch) {
            // return next(errorHandler(200, 'OTP verified successfully.'));
            return res.status(200).json({ success: true, message: 'OTP verified successfully.', id: existingOTP._id });
        } else {
            return next(errorHandler(400, 'Invalid OTP or OTP expired.'));
            // return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.' });
        }
    } catch (error) {
        next(error);
    }
};

const format = async (sotp, email) => {
    try {
        const subject = 'TravelDiaries - Account Verification OTP';
        const htmlContent = `
            <p>Dear Traveler,</p>
            <p>Welcome aboard TravelDiaries, your ultimate companion for documenting and sharing your breathtaking travel escapades!</p>
            <p>Your One-Time Password (OTP) for account verification:</p>
            <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
                <h2 style="margin: 0; padding: 0; font-weight: bold; color: #333;">${sotp}</h2>
            </div>
            <p>This OTP is your ticket to unlocking the full potential of TravelDiaries. Please ensure to use it within the next 10 minutes to verify your account.</p>
            <p>At TravelDiaries, we celebrate every journey, every moment of awe-inspiring beauty, and every story shared. Join our vibrant community of adventurers, nature enthusiasts, and passionate travelers.</p>
            <p>As you embark on this digital odyssey with TravelDiaries, may your adventures be boundless, your memories timeless, and your spirit forever wanderlust.</p>
            <p>Happy exploring!</p>
            <p>Warm regards,</p>
            <p>The TravelDiaries Team</p>
        `;
        if (await sendEmail(subject, email, htmlContent)) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export const sendMail = async (req, res, next) => {
    const { email, type } = req.body;

    if (type === "send") {
        try {
            const existingOTP = await OTP.findOne({ email });
            if (existingOTP) {
                const currentTime = new Date();
                if (existingOTP.expiry < currentTime) {
                    return next(errorHandler(400, 'OTP is expired, please resend OTP.'));
                }else{
                    return next(errorHandler(400, 'OTP is not expired, you can use the sent OTP.'));
                }
            }
            const otp = generateOTP(6);
            const hashedOTP = await bcryptjs.hash(otp, 10);
            if (await format(otp, email)) {
                next(errorHandler(200, 'OTP sent successfully'));
                // res.status(200).json({ success: true, message: 'OTP sent successfully' });
            } else {
                next(errorHandler(400, 'Something went wrong'));
                // res.status(400).json({ success: false, message: 'Something went wrong' });
            }
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 1);
            await OTP.create({ email, otp: hashedOTP, expiry: expiryTime });
        } catch (error) {
            next(errorHandler(404,'Something went wrong'));
        }
    } else {
        try {
            const existingOTP = await OTP.findOne({ email });
            if (existingOTP) {
                const currentTime = new Date();
                if (existingOTP.expiry > currentTime) {
                    return next(errorHandler(400, 'OTP is not expired, you can use the sent OTP.'));
                }
            }
            const currentTime = new Date();
            if (existingOTP && existingOTP.expiry < currentTime) {
                const otp = generateOTP(6);
                const hashedOTP = await bcryptjs.hash(otp, 10);
                existingOTP.otp = hashedOTP;
                existingOTP.expiry = new Date();
                existingOTP.expiry.setMinutes(existingOTP.expiry.getMinutes() + 10);
                await existingOTP.save();
                if (await format(otp, email)) {
                    return next(errorHandler(200, 'OTP has been reset and sent again.'));
                    // return res.status(200).json({ success: true, message: 'OTP has been reset and sent again.' });
                }
            }
            return next(errorHandler(404,'No OTP found or OTP is not expired.'));
        } catch (error) {
            next(error);
        }
    }
};

export const deleteEntry = async (req, res, next) => {
    try {
        await OTP.findByIdAndDelete(req.params.id);
        return next(errorHandler(200, 'deletion complete'));
        // res.status(200).json({ success: true, message: 'deletion complete' });
    } catch (error) {
        next(error);
    }
}

