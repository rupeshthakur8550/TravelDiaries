import express from 'express'
import {resetOTP, sendMail, verifyOTP} from '../controllers/otp.controller.js'

const router = express.Router();

router.post('/mail', sendMail);
router.post('/resend', resetOTP);
router.post('/verify', verifyOTP);

export default router;