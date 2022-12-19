const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); 

const commentSchema = new Schema({
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref: Users
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Comments = mongoose.model('comment', commentSchema);

module.exports = {Comments, commentSchema}