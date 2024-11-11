const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',

    },
    reciever : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
    },
    message : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
}) 


module.exports = mongoose.model('Messages', messageSchema)