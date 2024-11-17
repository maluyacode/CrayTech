const mongoose = require('mongoose');
const Populate = require("mongoose-autopopulate");
const mongooseDelete = require('mongoose-delete');

const commentModel = new mongoose.Schema({
    text_content: {
        type: String,
        required: true
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    replied_to: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
            default: null,
            autopopulate: { options: { sort: { createdAt: -1 } } },
        }
    ],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

// Apply default sort
commentModel.pre('find', function () {
    this.sort({ createdAt: -1 });
});

commentModel.pre('findOne', function () {
    this.sort({ createdAt: -1 });
});

commentModel.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true, deletedBy: true, });
commentModel.plugin(Populate);

module.exports = mongoose.model('comment', commentModel)