const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Admin', admin);