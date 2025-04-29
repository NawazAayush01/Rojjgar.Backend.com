require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWTSECRETKEY = process.env.JWTSECRETKEY;
// const userapp = express();
const user = require('../Models/user');
const userrouter = require("../Routes/addUser");
const jobSeekerSchema = require('../Models/jobseeker');
const userSchema = require('../Models/user');

 

router.use('/adduser', userrouter);

router.post('/loginbyemail', [
    body('email').isEmail().withMessage("Please Enter A Valid Email !!!"),
    body('password').notEmpty().withMessage("Please Enter Password !!!")
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }

        try{
            const finduser = await user.findOne({email : req.body.email});
            if(!finduser){
                return res.status(404).json({message : "User Not Found !!!"});
            }
            const ismatch = await bcrypt.compare(req.body.password, finduser.password);
            if(!ismatch){
                return res.status(400).json({message : "Invalid Credentials !!!"});
            }
            const token = jwt.sign({id : finduser.id, email : finduser.email}, JWTSECRETKEY, {expiresIn : "3d"});
            return res.status(200).json({
                message : "Login Successful !!!",
                token,
                finduser 
            });
        } catch(err) {
            return res.status(500).json({error :  err.message});
        }
    }
);

router.post('/loginbycontact', [ 
    body('contact').notEmpty().withMessage("Please Enter A Valid Email !!!"),
    body('password').notEmpty().withMessage("Please Enter Password !!!")
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }

        try{
            const finduser = await user.findOne({contact : req.body.contact});
            if(!finduser){
                return res.status(404).json({message : "User Not Found !!!"});
            }
            const ismatch = await bcrypt.compare(req.body.password, finduser.password);
            if(!ismatch){
                return res.status(400).json({message : "Invalid Credentials !!!"});
            }
            const token = jwt.sign({id : finduser.id, email : finduser.email}, JWTSECRETKEY, {expiresIn : "3d"});
            return res.status(200).json({
                message : "Login Successful !!!",
                token,
                finduser
            });
        } catch(err) {
            return res.status(500).json({error :  err.message});
        }
    }
);

router.post('/findjobseekers', [
    body('skill').notEmpty().withMessage("please enter a skill !!"),
    body('user').notEmpty().withMessage("user email is not valid !!")
],  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    try{
        const theuser = await userSchema.findOne({email :  req.body.user});
        console.log(theuser);
        const alljobseekersinarea = await jobSeekerSchema.find({
            $or: [
                { city: theuser.city },
                { pincode : theuser.pincode }
            ],
            skills : { $in : [req.body.skill] }
        });
        console.log("alljobseekersinarea: " + alljobseekersinarea);
        return res.status(200).json(alljobseekersinarea);
    }catch(err) {
        return res.status(500).json({error :  err.message});
    }
}); 


router.post('/:user/choosejobseeker', [
    body('jobseekerid').notEmpty().withMessage("there must be a job seeker selected !!!"),
    body('skill').notEmpty().withMessage("skill cannot be empty !!!")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }
    try{
        const thedate = new Date();
        const theuser = await userSchema.findOne({id :  req.params.user});
        const thejobseeker = await jobSeekerSchema.findOne({jobSeekerId : req.body.jobseekerid});
        theuser.historyJobProvisionSkill.push(req.body.skill);
        theuser.historyJobProvisionDate.push(thedate);
        theuser.historyJobProvidedTo.id.push(thejobseeker.jobSeekerId);
        theuser.historyJobProvidedTo.name.push(thejobseeker.name);
        theuser.historyJobProvidedTo.contact.push(thejobseeker.contact);
        thejobseeker.historyJobskill.push(req.body.skill);
        thejobseeker.historyJobDate.push(thedate);
        thejobseeker.historyJobProvider.id.push(theuser.id);
        thejobseeker.historyJobProvider.name.push(theuser.name);
        thejobseeker.historyJobProvider.contact.push(theuser.contact);
        await theuser.save();
        await thejobseeker.save();
        return res.status(200).json({theuser, thejobseeker});
    }catch(err){
        return res.status(500).json({error :  err.message});
    }
});

router.post('/:user/provideratingandreview', [
    body('jobseekerid').notEmpty().withMessage("jobseeker should be valid !!!"),
    body('rating').isNumeric().withMessage("rating should be a number !!!").isFloat({max : 100}).withMessage("rating should not exceed 100 !!!")
],  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    try{
        const thejobseeker = await jobSeekerSchema.findOne({jobSeekerId : req.body.jobseekerid});
        let totalrating = thejobseeker.rating * thejobseeker.noofratings;
        totalrating += parseInt(req.body.rating);
        thejobseeker.noofratings += 1;
        thejobseeker.rating = totalrating / thejobseeker.noofratings;
        
        if(req.body.review){
            thejobseeker.reviews.push(req.body.review);
        }
        await thejobseeker.save();
        return res.status(200).json({thejobseeker});
    }catch(err) {
        return res.status(500).json({error :  err.message});
    }
});



module.exports = router;