const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const adminApp = express();
const AdminSchema = require('../Models/admin');
const userSchema = require('../Models/user');
const jobSeekerSchema = require('../Models/jobseeker');
const jobseekerRouter = require('./addJobSeeker');
const userRouter = require('./addUser');
const JWTSECRETKEY = process.env.JWTSECRETKEY;



router.use('/addjobseeker', jobseekerRouter);
router.use('/adduser', userRouter); 

router.get('/:adminid/addedmembers', async (req, res) => {
    try {
        const admin = await AdminSchema.findOne({email : req.params.adminid});
        const added = admin.addedMembers;
        const addeddetail = await Promise.all(
            added.map(
                async (val) => {
                    const themembers1 = await userSchema.findOne({id : val});
                    const themembers2 = await jobSeekerSchema.findOne({jobSeekerId : val});
                    if(themembers1){
                        return themembers1;
                    }
                    return themembers2;
                }
            )
        );
        return res.status(200).json(addeddetail);
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

router.post('/login', [
    body('email').notEmpty().withMessage("please enter a valid email !!!"),
    body('password').notEmpty().withMessage("please enter a valid password !!!")
],  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }

    try{
        const findadmin = await AdminSchema.findOne({email : req.body.email});
        if(!findadmin){
            return res.status(404).json({message : "User Not Found !!!"});
        }
        const ismatch = await bcrypt.compare(req.body.password, findadmin.password);
        if(!ismatch){
            return res.status(400).json({message : "Invalid Credentials !!!"});
        }
        const token = jwt.sign({email : findadmin.email}, JWTSECRETKEY, {expiresIn : "3h"});
        return res.status(200).json({
            message : "Login Successful !!!", token, findadmin
        });
    } catch(err) {
        return res.status(500).json({message : err});
    }
});

module.exports = router;