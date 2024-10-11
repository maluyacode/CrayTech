const mongoose = require('mongoose');

const communityModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    banner: {
        public_id: String,
        url: String,
    },
    avatar: {
        public_id: String,
        url: String,
    },  // 
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    members: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            role: {
                type: String, // 'moderator', 'member'
            }
        }
    ],
    topics: [
        { type: mongoose.Schema.Types.ObjectId }
    ],

    community_type: { type: String, required: true }, // (private, restricted, public)
    allowed_posts: { type: String, required: true, default: 'any' }, // 'any', 'text only'
    banned_users: [
        { type: mongoose.Schema.Types.ObjectId }
    ],
}, { timestamps: true })

module.exports = mongoose.model('Community', communityModel);