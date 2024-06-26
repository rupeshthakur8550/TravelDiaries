import express from "express";
import { deleteUser, getUsername, signout, test, updateUser, verify, queries, allUsers, getUserDetails } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/verify', verify);
router.post('/signout', signout);
router.post('/getusername', getUsername);
router.post('/contact', queries);
router.get('/search_user', verifyToken, allUsers);
router.get('/getuserdetails/:id', verifyToken, getUserDetails);

export default router;