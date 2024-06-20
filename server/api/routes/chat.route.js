import express from 'express'
import { accessChat, fetchChat, createGroupChat, updateGroupChat, leaveGroupChat, deleteChat } from '../controllers/chat.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyToken, accessChat);
router.get('/fetch', verifyToken, fetchChat);
router.post('/group', verifyToken, createGroupChat);
router.put('/updategroupchat', updateGroupChat);
router.delete('/deletechat/:chatId', deleteChat);
router.put('/leavegroupchat/:chatId', leaveGroupChat);

export default router;