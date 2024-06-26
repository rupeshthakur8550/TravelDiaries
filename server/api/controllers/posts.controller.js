import { errorHandler } from "../utils/error.js";
import Post from '../models/post.model.js';
import User from "../models/user.model.js";

export const addPost = async (req, res, next) => {
    const { title, category, description, accessoriesNeeded, imageUrl, howToReach, whereToStay, whatToWear, duration, bestTimeToVisit, difficultyLevel, safetyTips, location } = req.body;

    const newPost = new Post({
        title,
        category,
        description,
        accessoriesNeeded,
        imageUrl,
        howToReach,
        whereToStay,
        whatToWear,
        duration,
        bestTimeToVisit,
        difficultyLevel,
        safetyTips,
        location,
        userId: req.user.id
    });

    try {
        const post = await newPost.save();
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(errorHandler(404, 'User Not Found'));
        }

        user.posts.push(post._id);
        await user.save();

        res.status(201).json(post);
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const updatePost = async (req, res, next) => {
    const { title, description, imageUrl, howToReach, whereToStay, whatToWear, duration, bestTimeToVisit, difficultyLevel, safetyTips, location } = req.body;

    const fieldsToUpdate = { title, description, imageUrl, howToReach, whereToStay, whatToWear, duration, bestTimeToVisit, difficultyLevel, safetyTips, location };

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const getPostsByUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ visibility: true }).populate('userId', 'profilePicture username');
        res.status(200).json(posts);
    } catch (err) {
        next(errorHandler(err, res));
    }
};

export const searchPosts = async (req, res, next) => {
    try {
        const searchQuery = req.query.search;
        const keyword = searchQuery ? {
            $and: [
                {
                    $or: [
                        { location: { $regex: searchQuery, $options: "i" } },
                        { title: { $regex: searchQuery, $options: "i" } },
                    ],
                },
                { visibility: true }
            ]
        } : { visibility: true };
        const posts = await Post.find(keyword).populate('userId', 'profilePicture username');
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

export const postVisibilityChange = async (req, res, next) => {
    const postId = req.params.id;
    const visibility = req.body.visibility;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.visibility = visibility;
        await post.save();
        res.status(200).json({ message: 'Post visibility updated successfully' });
    } catch (error) {
        next(error);
    }
};
