const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    images: [{
        public_id: String,
        url: String,
    }],
    videos: [{
        public_id: String,
        url: String,
    }],
    poll: [{
        option: String,
        votes: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }]
    }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
