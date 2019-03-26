const express = require('express');
const User = require('../models/userModel');
const authenticate = require('../middlewares/authentication');
const router = new express.Router();


// CREATE NEW USER (SIGN UP)
router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        //await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(e);
    }
});

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

// FETCH PROFILE
router.get('/myprofile', authenticate, async (req, res) => {
    res.send(req.user);
});

// LOGOUT

router.post('/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ status: "logout" });
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;