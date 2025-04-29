const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const stateSchema = require('../Models/states');
const districtSchema = require('../Models/districts');
const citySchema = require('../Models/cities');
const pincodeSchema = require('../Models/pincode');
const websiteStatsSchema = require('../Models/websitestats');
const jobSeekerSchema = require('../Models/jobseeker');
const AdminSchema = require('../Models/admin'); 



router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact').isMobilePhone().withMessage('Contact is required and must be valid'),
    body('state').notEmpty().withMessage('State is required and must be valid'),
    body('district').notEmpty().withMessage('District is required and must be valid'), 
    body('city').notEmpty().withMessage('City is required and must be valid'),
    body('addressLine').notEmpty().withMessage('Address Line is required and must be valid'),
    body('pincode').isInt().withMessage('Pincode is required and must be valid'), 
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        try{
            const existingseeker = await jobSeekerSchema.findOne({contact : req.body.contact});
            if(existingseeker){
                return res.status(500).json({message : "Job Seeker Already Exists !!!"});
            }

            const websiteinstance = await websiteStatsSchema.findOne({id : "-1"});
            const stateinstance = await stateSchema.findOne({name : req.body.state});
            const districtinstance = await districtSchema.findOne({id : req.body.district}); 
            const cityinstance = await citySchema.findOne({id : req.body.city});
            const pincodeinstance = await pincodeSchema.findOne({id : req.body.pincode});
        
            websiteinstance.noofjobseekers += 1;
            stateinstance.noofjobseekers += 1;
            districtinstance.noofjobseekers += 1;
            cityinstance.noofjobseekers += 1;
            pincodeinstance.noofjobseekers += 1;

            const newjobseekerid = pincodeinstance.id + cityinstance.id + cityinstance.noofjobseekers + pincodeinstance.noofjobseekers;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            
            const newjobseeker = new jobSeekerSchema({
                name : req.body.name,
                jobSeekerId : newjobseekerid,
                password : hashedPassword,
                contact : req.body.contact,
                state : stateinstance.name,
                district : districtinstance.name,
                city : cityinstance.id,
                cityname : cityinstance.name,
                pincode : req.body.pincode,
            });

            if(req.body.councellor){
                newjobseeker.councellor = req.body.councellor;
                const thecouncellor = await AdminSchema.findOne({email : req.body.councellor});
                thecouncellor.addedMembers.push(newjobseekerid);
                await thecouncellor.save();
            }


            websiteinstance.jobseekers.push(newjobseekerid);
            stateinstance.jobseekers.push(newjobseekerid);
            districtinstance.jobseekers.push(newjobseekerid);
            cityinstance.jobseekers.push(newjobseekerid);
            pincodeinstance.jobseekers.push(newjobseekerid);

            await newjobseeker.save();
            await websiteinstance.save();
            await stateinstance.save();
            await districtinstance.save();
            await cityinstance.save();
            await pincodeinstance.save();
            return res.status(200).json({Jobseeker : newjobseeker});
        } catch(err) {
            console.log(err);
            return res.status(500).json({error : err.message});
        }
    }
);


router.post('/addskills',[
    body('jobseekerid').notEmpty().withMessage('jobseekerid is required'),
    body('skillset').customSanitizer(value => value.split(',')).isArray({min : 1}).withMessage('Skills should be a comma-separated list of strings').custom((skills) => skills.every(skill => typeof skill === 'string' && skill.trim() !== '')).withMessage('Each skill must be a non-empty string')
],  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try{
        const theseeker = await jobSeekerSchema.findOne({jobSeekerId : req.body.jobseekerid});
        if(!theseeker){
            return res.status(404).json({message : "Job Seeker Not Found !!!"});
        }
        theseeker.skills = req.body.skillset;
        await theseeker.save();
        
        return res.status(200).json({message : "skills added successfully!!", theseeker});
    } catch(err) {
        return res.status(500).json({error :  err.message});
    }
});

module.exports = router;