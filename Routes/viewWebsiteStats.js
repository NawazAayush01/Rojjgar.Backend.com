const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const website = require('../Models/websitestats');
const stateSchema = require('../Models/states');
const districtSchema = require('../Models/districts');
const citySchema = require('../Models/cities');
const pincodeSchema = require('../Models/pincode');
const AdminSchema = require('../Models/admin');
const userSchema = require('../Models/user');
const jobSeekerSchema = require('../Models/jobseeker');

router.get('/', async (req, res) => {
    try {
        const stats = await website.find();
        if(!stats){
            return res.status(404).json({message : "go corona go!"})
        }
        return res.status(200).json({stats});
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/statewisedata', async (req, res) => {
    try{
        const statewisedata = await stateSchema.find();
        return res.status(200).json(statewisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificstatedata/:statecode', async (req, res) => {
    try{
        const statewisedata = await stateSchema.findOne({id : req.params.statecode});
        if(!statewisedata){
            return res.status(404).json({error : "state not found !!"});
        }
        return res.status(200).json(statewisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/alldistrictdata', async (req, res) => {
    try{
        const districtwisedata = await districtSchema.find();
        return res.status(200).json(districtwisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificStateDistrictdata/:statecode',[
    body('state').notEmpty().withMessage("please enter state")
], async (req, res) => {
    try{
        const thestate = await stateSchema.findOne({id : req.params.statecode});
        const statedistricts = thestate.districtcodes;
        const districtwisedata = await Promise.all(
            statedistricts.map(
                async (val) => {
                    const thedistrict = await districtSchema.findOne({id : val});
                    return thedistrict;
                }
            )
        );
        return res.status(200).json(districtwisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificdistrictdata/:districtid', async (req, res) => {
    try{
        const districtwisedata = await districtSchema.findOne({id : req.params.districtid});
        return res.status(200).json(districtwisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/allcitydata', async (req, res) => {
    try{
        const citywisedata = await citySchema.find();
        return res.status(200).json(citywisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificStateCityData/:state', async (req, res) => {
    try{
        const thestate = await stateSchema.findOne({id : req.params.state});
        const statecitys = thestate.citycodes;
        const citywisedata = await Promise.all(
            statecitys.map(
                async (val) => {
                    const thecity = await citySchema.findOne({id : val});
                    return thecity;
                }
            )
        );
        return res.status(200).json(citywisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificDistrictCitydata/:districtid', async (req, res) => {
    try{
        const thedistrict = await districtSchema.findOne({id : req.params.districtid});
        const statecitys = thedistrict.citycodes;
        const citywisedata = await Promise.all(
            statecitys.map(
                async (val) => {
                    const thecity = await citySchema.findOne({id : val});
                    return thecity;
                }
            )
        );
        return res.status(200).json(citywisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificcitydata/:cityid', async (req, res) => {
    try{
        const citywisedata = await citySchema.findOne({id : req.params.cityid});
        return res.status(200).json(citywisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }   
});

router.get('/allpincodesdata', async(req, res) => {
    try{
        const allpincodesdata = await pincodeSchema.find();
        return res.status(200).json(allpincodesdata);
    }catch(err){
        return res.status(500).json({message : err});
    }
})

router.get('/specificstatepincodedata/:state', async (req, res) => {
    try{
        const thedistrict = await stateSchema.findOne({id : req.params.state});
        const pincodes = thedistrict.pincodes;
        const pincodewisedata = await Promise.all(
            pincodes.map(
                async (val) => {
                    const thepincode = await pincodeSchema.findOne({id : val});
                    return thepincode;
                }
            )
        );
        return res.status(200).json(pincodewisedata);s
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificDistrictPincodeData/:districtid', async (req, res) => {
    try{
        const thedistrict = await districtSchema.findOne({id : req.params.districtid});
        const districtpincodes = thedistrict.pincodes;
        const districtwisepincodedata = await Promise.all(
            districtpincodes.map(
                async (val) => {
                    const thepin = await pincodeSchema.findOne({id : val});
                    return thepin;
                }
            )
        );
        return res.status(200).json(districtwisepincodedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/specificpincodedata/:pincode', async (req, res) => {
    try{
        const pincodewisedata = await pincodeSchema.findOne({id : req.params.pincode});
        return res.status(200).json(pincodewisedata);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/getalladmins', async (req, res) => {
    try {
        const admins = await AdminSchema.find();
        if(!admins){
            return res.status(404).json({message : "No admin found!"})
        }
        return res.status(200).json({admins});
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.get('/allusers', async (req, res) => {
    try {
        const users = await userSchema.find();
        return res.status(200).json({users});
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

router.get('/alljobseekers', async (req, res) => {
    try {
        const jobseekers = await jobSeekerSchema.find();
        return res.status(200).json({jobseekers});
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

module.exports = router;