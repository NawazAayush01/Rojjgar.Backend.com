const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        default : ""
    },
    id : {
        type : String,
        required : true,
        unique : true,
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
    contact : {
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
    addressLine : {
        type : String,
        required : true,
        default : ""
    },
    pincode : {
        type : String,
        required : true,
        default : ""
    },
    councellor : {
        type : String,
        default : ""
    }, 
    historyJobProvisionSkill : {
        type : [String],
        default  : []
    },
    historyJobProvisionDate : {
        type : [Date],
        default  : []
    },
    historyJobProvidedTo : {
        id : {
            type : [String],
            default : []
        },
        name : {
            type : [String],
            default : []
        },
        contact : {
            type : [String],
            default : []
        },
    },
    rating : {
        type : Number,
        default : 0
    }
});

const userSchema = mongoose.model('userSchema', user);

module.exports = userSchema;