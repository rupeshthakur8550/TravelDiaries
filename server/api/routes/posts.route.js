import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { addPost, getPosts, getPostById, updatePost, deletePost, searchPosts, getPostsByUser, postVisibilityChange } from '../controllers/posts.controller.js';

const router = express.Router();

router.post('/addpost', verifyToken, addPost);
router.get('/getallposts', getPosts);
router.get('/getpost/:id', getPostById);
router.put('/updatepost/:id', verifyToken, updatePost);
router.delete('/deletepost/:id', verifyToken, deletePost);
router.get('/searchposts', verifyToken, searchPosts);
router.get('/getuserposts', verifyToken, getPostsByUser);
router.put('/postvisibility/:id', verifyToken, postVisibilityChange);

export default router;
