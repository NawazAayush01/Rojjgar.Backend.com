const mongoose = require('mongoose');

const websiteStats = new mongoose.Schema({
    id              :   {   type    :   String, default : "-1", unique : "true"    },
    noofstates      :   {   type    :   Number, default  : 0       },
    statecodes      :   {   type    :   [String],   default  : []    },
    statenames      :   {   type    :   [String],   default  : []    },
    noofdistricts   :   {   type    :   Number, default  : 0       },
    districtcodes   :   {   type    :   [String]  ,     default  : []  },
    districtnames   :   {   type    :   [String] ,  default  : []   },
    noofcities      :   {   type    :   Number , default  : 0     },
    citycodes       :   {   type    :   [String],   default  : []    },
    citynames       :   {   type    :   [String],   default  : []    },
    noofpincodes    :   {   type    :   Number, default  : 0       },
    pincodes        :   {   type    :   [String],   default  : []    },
    noofadmins      :   {   type    :   Number, default  : 0    },
    adminids        :   {   type    :   [String],   default  : []    },
    noofusers       :   {   type    :   Number , default  : 0      },
    users           :   {   type    :   [String],   default  : []    },
    noofjobseekers  :   {   type    :   Number , default  : 0      },
    jobseekers      :   {   type    :   [String],   default  : []    }
}); 

const websiteStatsSchema = mongoose.model('websiteStatsSchema', websiteStats);

module.exports =  websiteStatsSchema;