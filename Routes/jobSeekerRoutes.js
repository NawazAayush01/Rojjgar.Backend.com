require('dotenv').config();
const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const jobseekerapp = express();
const jobseekerrouter = require('../Routes/addJobSeeker');
const jobSeekerSchema = require('../Models/jobseeker');
const JWTSECRETKEY = process.env.JWTSECRETKEY;


router.use('/addjobseeker', jobseekerrouter);

router.post('/login', [
    body('id').notEmpty().withMessage("Please Enter A Valid ID !!!"),
    body('password').notEmpty().withMessage("Please Enter Password !!!")
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() }); 
        } 

        try{
            const finduser = await jobSeekerSchema.findOne({jobSeekerId : req.body.id});
            if(!finduser){
                return res.status(404).json({message : "Job Seeker Not Found !!!"});
            }
            const ismatch = await bcrypt.compare(req.body.password, finduser.password);
            if(!ismatch){
                return res.status(400).json({message : "Invalid Credentials !!!"});
            }
            const token = jwt.sign({id : finduser.jobSeekerId}, JWTSECRETKEY, {expiresIn : "3d"});
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


module.exports = router;