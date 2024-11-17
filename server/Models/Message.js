const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text_content: {
        type: String,
        required: true
    },
    readBy: [ // not applicable
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ], // Users who have read the message
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)