const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loungeSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    location:{latitude:{type:String}, longitude:{type:String}},
    ownerName:String,
    image:String
});

module.exports = mongoose.model('lounge', loungeSchema);