const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../Models/user');
const stateSchema = require('../Models/states');
const districtSchema = require('../Models/districts');
const citySchema = require('../Models/cities');
const pincodeSchema = require('../Models/pincode');
const websiteStatsSchema = require('../Models/websitestats');
const AdminSchema = require('../Models/admin');





router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact').isMobilePhone().withMessage('Contact is required and must be valid'),
    body('email').isEmail().withMessage('Email is required and must be valid'),
    body('state').notEmpty().withMessage('State is required and must be valid'),
    body('district').notEmpty().withMessage('District is required and must be valid'),
    body('city').notEmpty().withMessage('City Code is required and must be valid'),
    body('addressLine').notEmpty().withMessage('Address Line is required and must be valid'),
    body('pincode').isInt().withMessage('Pincode is required and must be valid'),
],  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array()); 
        return res.status(400).json({errors : errors.array()}); 
    }

    try{
        const doesuserexist = await userSchema.findOne({
            $or: [
                { email: req.body.email },
                { contact: req.body.contact }
            ]
        }); 
        if(doesuserexist){
            return res.status(409).json({message : "User already exists !!!"});
        }

        const websiteinstance = await websiteStatsSchema.findOne({id : "-1"});
        const stateinstance = await stateSchema.findOne({name : req.body.state});
        const districtinstance = await districtSchema.findOne({id : req.body.district}); 
        const cityinstance = await citySchema.findOne({id : req.body.city});
        const pincodeinstance = await pincodeSchema.findOne({id : req.body.pincode});

        websiteinstance.noofusers += 1;
        stateinstance.noofusers += 1;
        districtinstance.noofusers += 1;
        cityinstance.noofusers += 1;
        pincodeinstance.noofusers += 1;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newuserid = pincodeinstance.id + cityinstance.id + cityinstance.noofusers + pincodeinstance.noofusers;

        const newuser = new userSchema({
            name : req.body.name,
            id : newuserid,
            password : hashedPassword,
            contact : req.body.contact,
            email : req.body.email,
            state : stateinstance.name,
            district : districtinstance.name,
            city : cityinstance.name,
            addressLine : req.body.addressLine,
            pincode : req.body.pincode,
        });

        if(req.body.councellor){
            newuser.councellor = req.body.councellor;
            const thecouncellor = await AdminSchema.findOne({email : req.body.councellor});
            thecouncellor.addedMembers.push(newuserid);
            await thecouncellor.save();
        }

        websiteinstance.users.push(newuserid);
        stateinstance.users.push(newuserid);
        districtinstance.users.push(newuserid);
        cityinstance.users.push(newuserid);
        pincodeinstance.users.push(newuserid);

        await newuser.save();
        await websiteinstance.save();
        await stateinstance.save();
        await districtinstance.save();
        await cityinstance.save();
        await pincodeinstance.save();

        return res.status(200).json({User : newuser});
    }catch(err){
        console.error("Error details:", err);
        return res.status(500).json({message : err});
    }
});

module.exports = router;