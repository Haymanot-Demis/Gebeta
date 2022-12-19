const mongoose = require('mongoose');
const Dishes = require('./dishes');
const Users = require('./users');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    dish_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:Dishes
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    takeaway:{
        type:Boolean,
        default:false
    },
    palceToDeliver:{
        type:String,
        default:''
    },
    totalPrice:{
        type:Number
    }
},
{
    timestamps:true
});

const Orders = mongoose.model('order', orderSchema);

module.exports = Orders;