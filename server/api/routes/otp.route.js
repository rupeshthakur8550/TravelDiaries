import express from 'express'
import {sendMail, verifyOTP} from '../controllers/otp.controller.js'

const router = express.Router();

router.post('/mail', sendMail);
router.post('/verify', verifyOTP);

export default router;