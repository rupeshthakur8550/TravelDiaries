import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://freesvg.org/img/abstract-user-flat-4.png"
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    mobileNo: {
        type: String,
        default: "+91-0000000000"
    },
    dateOfBirth: {
        type: String,
    },
    verification: {
        type: String,
        required: true,
    },
    profile_complete_status: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;