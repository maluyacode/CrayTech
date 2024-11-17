const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    comments: [{
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

postSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true, });

module.exports = mongoose.model('Post', postSchema);
