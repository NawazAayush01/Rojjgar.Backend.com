const mongoose = require('mongoose');

const state = new mongoose.Schema({
    name            : {     type : String,      required : true,    unique : true,  default : ""     },
    noofdistricts   : {     type : Number,      default  : 0                     },
    districtcodes   : {     type : [String],    default  : []                    },
    districtnames   : {     type : [String],    default  : []                    },
    noofcities      : {     type : Number,      default  : 0                     },
    citycodes       : {     type : [String],    default  : []                    },
    citynames       : {   type    :   [String],   default  : []    },
    noofpincodes    :   {   type    :   Number, default  : 0       },
    pincodes        :   {   type    :   [String],   default  : []    },
    noofusers       : {     type : Number,      default  : 0                     },
    users           : {     type : [String],    default  : []                    },
    noofjobseekers  : {     type : Number,      default  : 0                     },
    jobseekers      : {     type : [String],    default  : []                    },
});

const stateSchema = mongoose.model('stateSchema', state);

module.exports = stateSchema;  