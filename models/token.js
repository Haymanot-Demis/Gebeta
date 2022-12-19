const { TokenExpiredError } = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users');

const tokenSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref: Users,
        required:true
    },
    token:{
        type:String,
        required:true
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:15*60
    }
});

const Tokens = mongoose.model('token', tokenSchema);

module.exports = Tokens;