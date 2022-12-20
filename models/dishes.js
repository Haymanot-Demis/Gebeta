const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {commentSchema} = require('./comments');
const Lounges = require('./lounges');

const dishSchema = new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    type:{  // select from a datalist
        type:String,
        required:true
    },
    category:{  // select from a datalist
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    comment : [commentSchema],
    availableIn : [{ // select from a datalist
        type:mongoose.Schema.Types.ObjectId,
        ref: Lounges
    }]
});

const Dishes = mongoose.model('dish', dishSchema);

module.exports = Dishes;