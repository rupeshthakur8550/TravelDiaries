import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'https://kinsta.com/wp-content/uploads/2017/11/how-to-start-a-travel-blog.png'
    },
    location: {
        type: String,
        required: true
    },
    howToReach: {
        type: String,
        required: true
    },
    accessoriesNeeded: {
        type: [String],
        required: true
    },
    whereToStay: {
        type: String,
        required: true
    },
    whatToWear: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    bestTimeToVisit: {
        type: String,
        required: true
    },
    difficultyLevel: {
        type: String,
        required: true
    },
    safetyTips: {
        type: [String],
        required: true
    },
    category: {
        type: [String],
        required: true,
        default: ['Uncategorized']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;