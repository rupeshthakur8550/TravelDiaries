import express from 'express'
import { accessChat, fetchChat, createGroupChat, updateGroupChat } from '../controllers/chat.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyToken, accessChat);
router.get('/fetch', verifyToken, fetchChat);
router.post('/group', verifyToken, createGroupChat);
// router.put('/rename', verifyToken, renameGroup);
// router.put('/groupremove', verifyToken, removeFromGroup);
// router.put('/groupadd', verifyToken, addToGroup);
router.put('/updategroupchat', updateGroupChat);

export default router;