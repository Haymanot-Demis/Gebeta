const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email:{
        type:String,
        required:true
    },
    firstname : {
        type:String,
        default :''
    },
    lastname : {
        type:String,
        default :''
    },
    admin : {
        type : Boolean,
        default : false
    },
    profileImage:{
        type:String,
        default:''
    }
})

User.plugin(passportLocalMongoose);

const Users = mongoose.model('user', User);

module.exports = Users;