const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const website = require('../Models/websitestats');
const stateSchema = require('../Models/states');
const districtSchema = require('../Models/districts');
const citySchema = require('../Models/cities');
const pincodeSchema = require('../Models/pincode');
const AdminSchema = require('../Models/admin');


//updating the id creation for all apis



router.post('/addstate', [
    body('name').notEmpty().withMessage("enter a valid name of state")
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors : errors.array()});
    }
    try { 
        const websiteinstance = await website.findOneAndUpdate(
            {id : "-1"},
            {},
            {upsert : true, new : true}
        );
        websiteinstance.noofstates += 1;
        const newState = new stateSchema({
            name : req.body.name,
            id : websiteinstance.noofstates,
        });
        websiteinstance.statecodes.push(newState.id);
        websiteinstance.statenames.push(newState.name);
        await newState.save();
        await websiteinstance.save();
        return res.status(200).json(newState);
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

router.post('/adddistrict', [
    body('name').notEmpty().withMessage("enter a valid name"),
    body('state').notEmpty().withMessage("enter a valid statecode")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors : errors.array()});
    }
    try{
        const websiteinstance = await website.findOne({id : "-1"});
        const stateinstance = await stateSchema.findOne({id : req.body.state});
        websiteinstance.noofdistricts += 1;
        websiteinstance.districtnames.push(req.body.name);
        stateinstance.noofdistricts +=1;
        stateinstance.districtnames.push(req.body.name);
        const districtidnew = stateinstance.id + stateinstance.noofdistricts;
        const newdistrict = new districtSchema({
            name : req.body.name,
            id : districtidnew,
            state : req.body.state
        });
        await newdistrict.save();
        websiteinstance.districtcodes.push(districtidnew);
        stateinstance.districtcodes.push(districtidnew);
        await websiteinstance.save();
        await stateinstance.save();
        return res.status(200).json(newdistrict);
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

router.post('/addcity', [
    body('name').notEmpty().withMessage("enter valid name"),
    body('district').notEmpty().withMessage("enter valid district id")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors : errors.array()});
    }
    try{
        const websiteinstance = await website.findOne({id : "-1"});
        const districtinstance = await districtSchema.findOne({id : req.body.district});
        const stateinstance = await stateSchema.findOne({id : districtinstance.state});
        districtinstance.noofcities += 1;
        districtinstance.citynames.push(req.body.name);
        stateinstance.noofcities += 1;
        stateinstance.citynames.push(req.body.name);
        websiteinstance.noofcities += 1;
        websiteinstance.citynames.push(req.body.name);
        const newcityid = districtinstance.id + districtinstance.noofcities;
        const newcity = new citySchema({
            state : stateinstance.name,
            district : districtinstance.name,
            districtid : districtinstance.id,
            name : req.body.name,
            id : newcityid,
        });
        districtinstance.citycodes.push(newcityid);
        stateinstance.citycodes.push(newcityid);
        websiteinstance.citycodes.push(newcityid);
        await newcity.save();
        await websiteinstance.save();
        await stateinstance.save();
        await districtinstance.save();
        return res.status(200).json(newcity);
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

router.post('/addpincode', [
    body('pincode').notEmpty().withMessage("enter a valid pincode"),
    body('district').notEmpty().withMessage("enter valid district")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors : errors.array()});
    }
    try{
        const enteredpincode = req.body.pincode;
        const ifpincodeexist = await pincodeSchema.findOne({id : enteredpincode});
        if(ifpincodeexist){
            return res.status(500).json({message : "pincode already exists"});
        }
        const websiteinstance = await website.findOne({id : "-1"});
        const districtinstance = await districtSchema.findOne({id : req.body.district});
        const stateinstance = await stateSchema.findOne({id : districtinstance.state});
        districtinstance.noofpincodes += 1;
        districtinstance.pincodes.push(enteredpincode);
        stateinstance.noofpincodes += 1;
        stateinstance.pincodes.push(enteredpincode);
        websiteinstance.noofpincodes += 1;
        websiteinstance.pincodes.push(enteredpincode);
        const newpincode = new pincodeSchema({
            state : stateinstance.name,
            district : districtinstance.name,
            districtid : districtinstance.id,
            id : enteredpincode,
        });
        await newpincode.save();
        await websiteinstance.save();
        await stateinstance.save();
        await districtinstance.save();
        return res.status(200).json(newpincode);
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

router.post('/addadmin', [
    body('name').notEmpty().withMessage("please enter a valid name"),
    body('email').notEmpty().withMessage("please enter a valid email"),
    body('password').isLength(6).withMessage("password should contain atleast 6 charactors"),
    body('citycode').notEmpty().withMessage("enter valid citycode"),
    body('pincode').notEmpty().withMessage("enter valid pincode")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors : errors.array()});
    }

    try{
        const doesadminexist = await AdminSchema.findOne({email : req.body.email}); 
        if(doesadminexist){
            return res.status(500).json({message : "Admin already exists !!!"});
        }
        const websiteinstance = await website.findOne({id : "-1"});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const cityinstance = await citySchema.findOne({id : req.body.citycode});
        const districtinstance = await districtSchema.findOne({id : cityinstance.districtid});
        const stateinstance = await stateSchema.findOne({id : districtinstance.state});
        const newadmin = new AdminSchema({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            state : stateinstance.id,
            district : districtinstance.id,
            city : req.body.citycode,
            pincode : req.body.pincode
        });
        await newadmin.save();
        websiteinstance.noofadmins += 1;
        websiteinstance.adminids.push(req.body.email);
        await websiteinstance.save();
        return res.status(200).json(newadmin);
    } catch(err) {
        return res.status(500).json({message : err.message});
    }
});

module.exports = router;