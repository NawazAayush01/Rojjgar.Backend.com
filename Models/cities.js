const mongoose = require('mongoose');

const city = new mongoose.Schema({
    state           :   {    type : String,   required : true,  default : ""    },
    district :          {    type : String,   required : true,  default : ""    },
    districtid :        {    type : String,   required : true,  default : ""    },
    name :              {    type : String,   required : true,  default : ""    },
    id :                {    type : String,   required : true,  unique : true , default : ""   },
    noofusers :         {    type : Number, default  : 0                        },
    users :             {    type : [String],     default  : []                   },
    noofjobseekers :    {    type : Number   ,  default  : 0                     },
    jobseekers :        {    type : [String],     default  : []                   },
}); 

const citySchema = mongoose.model('citySchema', city);

module.exports = citySchema;