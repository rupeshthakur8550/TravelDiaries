import mongoose from 'mongoose';

const queriesSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
    },
    email: {
        type : String,
        required: true,
        unique: true,
    },
    message : {
        type : String,
        required: true,
    }
},{timestamps: true});

const Query = mongoose.model('Query', queriesSchema);

export default Query;