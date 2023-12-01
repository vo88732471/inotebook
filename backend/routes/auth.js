const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = 'mynamevivek'

//ROUTE 1:create a user using POST "api/auth/createuser". no login required
router.post('/createuser', [
    body('email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password should be grater than 5 char').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, "errors": errors.array() });
    }
    
    //check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user != null) {
            return res.status(400).json({ success, error: "sorry a user with this email exists already" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occured")
    }



})

//ROUTE 2:authenticat a user using POST "api/auth/login" no login requires;
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }
    let success = false;
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: 'please try to login with correct credentials' });
        }
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ success, error: 'please try to login with correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occured")
    }
});

//ROUTE 3:get loggedin user details using POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error occured")
    }
});


module.exports = router