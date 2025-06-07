const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"],
    },

    email: {
        type: String,
        required: [true, "Please provide your email!"],
        unique: [true, "Email already exists!"],
    },

    password: {
        type: String, 
        required: [true, "Please provide your password!"],
    },

    avatar: {
        type: String,
        required: [true, "Please pick an avatar!"],
    },

    friends: [
        {
            friendId: {
                type: Schema.Types.ObjectId,
                ref: 'Users',
                required: true
            },

            customName: {
                type: String,
                required: false
            }
        }
    ]
});

module.exports = mongoose.model('Users', userSchema); 