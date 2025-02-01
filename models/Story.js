const mongoose = require('mongoose');
const { Schema } = mongoose

const storySchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    image: {
        public_id: String,
        url: String
    },

    caption: String,

    text: String,

    date: {
        type: Date,
        default: Date.now,
        expires: '24h'
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String,
                // required: true
            }
        }
    ]
});






module.exports = mongoose.model("Story", storySchema);

