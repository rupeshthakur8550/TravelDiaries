import express from "express";
import { allMessages, sendMessage } from '../controllers/message.controller.js'
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/getmessages/:chatId', verifyToken, allMessages);

export default router;