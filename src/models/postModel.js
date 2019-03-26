const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: Buffer
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;