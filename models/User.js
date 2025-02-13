const mongoose = require('mongoose');
const { Schema } = mongoose

const userSchema = new Schema({
    userName : {
        type : String,
        required: true,
    },

    profilePic : {
        public_id: String,
        url: String
    },

    email : {
        type: String,
        required: true,
        unique: true
    },

    password : {
        type: String,
        required: [true, 'Please Entre A Valid Password']
    },

    bio : String,

    about : String,

    posts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],

    stories : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story'
        }
    ],

    followers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    following : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    resetPassTokenHash : String,
    resetPassValidation : Date
});


module.exports = mongoose.model("User", userSchema);

