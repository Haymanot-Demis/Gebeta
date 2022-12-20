const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loungeSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    latitude:{
        type:String,
        default:''
    },
    longitude:{
        type:String,
        default:''
    },
    ownerName:String,
    image:{
        type:String,
        default:''
    }
});

module.exports = mongoose.model('lounge', loungeSchema);