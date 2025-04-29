const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        default : ""
    },
    email : {
        type :  String,
        required : true,
        unique : true,
        default : ""
    },
    password : {
        type : String,
        required : true,
        default : ""
    }, 
    state : {
        type : String,
        required : true,
        default : ""
    },
    district : {
        type : String,
        required : true,
        default : ""
    },
    city : {
        type : String,
        required : true,
        default : ""
    },
    pincode : {
        type : String,
        required : true,
        default : ""
    },
    addedMembers : {
        type : [String],
        default  : []
    }
});

const AdminSchema = mongoose.model('AdminSchema', admin);

module.exports = AdminSchema;