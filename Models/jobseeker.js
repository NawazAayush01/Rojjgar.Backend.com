const mongoose = require('mongoose');

const jobSeeker = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        default : "",
    },
    jobSeekerId : {
        type :  String,
        required : true,
        unique : true,
        default : "", 
    },
    password : {
        type : String,
        required : true,
        default : "",
    },
    contact : {
        type : String,
        required : true,
        unique : true,
        default : "",
    },
    state : {
        type : String,
        required : true,
        default : "",
    },
    district : {
        type : String,
        required : true,
        default : "",
    },
    city : {
        type : String,
        required : true,
        default : "",
    },
    addressLine : {
        type : String,
        required : true,
        default : "",
    },
    pincode : {
        type : String,
        required : true,
        default : "",
    },
    skills : {
        type : [String],
        required : false,
        default : [],
    },
    councellor : {
        type : String,
        default : ""
    }, 
    historyJobskill : {
        type : [String],
        required : false,
        default : [],
    },
    historyJobDate : {
        type : [Date],
        required : false,
        default : [],
    },
    historyJobProvider : {
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
    noofratings : {
        type : Number,
        default : 0
    },
    rating :{
        type : Number,
        default : 0
    },
    reviews : {
        type : [String],
        default : [],
    }
});

const jobSeekerSchema = mongoose.model('jobSeekerSchema', jobSeeker);

module.exports = jobSeekerSchema;