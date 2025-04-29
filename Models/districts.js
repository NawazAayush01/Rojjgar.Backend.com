const mongoose = require('mongoose');

const district = new mongoose.Schema({
    state           :   {   type : String,      required : true,    default : ""     },
    name            :   {   type : String,      required : true,    default : ""     },
    id              :   {   type : String,      required : true,    unique : true,  default : ""     },
    noofcities      :   {   type : Number,        default  : 0                   },
    citycodes       :   {   type : [String],   default  : []                     },
    citynames       :   {   type    :   [String],   default  : []    },
    noofpincodes    :   {   type    :   Number, default  : 0       },
    pincodes        :   {   type    :   [String],   default  : []    },
    noofusers       :   {   type : Number,     default  : 0                      },
    users           :   {   type : [String],   default  : []        },
    noofjobseekers  :   {   type : Number,     default  : 0         },
    jobseekers      :   {   type : [String],   default  : []                    },
}); 

const districtSchema = mongoose.model('districtSchema', district);

module.exports = districtSchema; 