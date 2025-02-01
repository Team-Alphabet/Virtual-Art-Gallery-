const mongoose = require('mongoose');
const { Schema } = mongoose

const postSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    image: {
        public_id: String,
        url: String
    },

    caption: String,

    date: {
        type: Date,
        default: Date.now
    },

    likes: [
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
    ],

    price: Number,
    buyFlag: Boolean
});

module.exports = mongoose.model("Post", postSchema);

