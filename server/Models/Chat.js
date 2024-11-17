const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    is_group: { // not applicable
        type: Boolean,
        default: false
    },
    chat_name: {
        type: String
    }, // Only applicable if isGroup is true
    last_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }, // Reference to the last message in the conversation
    unread_count: {
        type: Number, default: 0
    }, // Number of unread messages
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    last_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    last_message_delivered_at: {
        type: Date,
        default: Date.now,
    },
    deleted_by: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('chat', chatSchema)