/**
 * Here the user model reffers to regular users, authors and admins
 */


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        min: 3,
        max: 50,
        required: true,
        unique: true
    },
    email:{

        address: {
            type: String,
            required: true,
            unique: true
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    pwd: {
        type: String,
        required: true
    },
    privilege: {
        type: String,
        enum: ["admin", "author", "user"],
        default: "user"
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const User = mongoose.model('User', userSchema);    

async function hashpwd(pwd) {
    return await bcrypt.hash(pwd, 10);
}



exports.User = User;
exports.hash = hashpwd;
