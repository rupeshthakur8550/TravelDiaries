import express from 'express'
import { signin, signup, googleAuth, forgetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleAuth);
router.post('/forgetpassword', forgetPassword);

export default router;