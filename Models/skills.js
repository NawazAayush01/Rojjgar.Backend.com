const mongoose = require('mongoose');

const skills = mongoose.Schema({
    id : {
        type : String,
        unique : true,
        required : true,
        default : ""
    },
    name : {
        type : String,
        unique : true,
        required : true,
        default : ""
    },
    jobseekers : {
        type : [String],
        default : []
    }
});

const skillsSchema = mongoose.model('skillsSchema', skills);

module.export = skillsSchema;