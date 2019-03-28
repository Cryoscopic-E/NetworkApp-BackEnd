const express = require('express');
const User = require('../models/userModel');
const authenticate = require('../middlewares/authentication');
const router = new express.Router();
const multer = require('multer')
const sharp = require('sharp')


const imageUpload = multer({
    limits: {
        fileSize: 100000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("File must be jpg, jpeg or png"));
        }
        cb(undefined, true);
    }
})
// CREATE NEW USER (SIGN UP)
router.post('/signup', imageUpload.single('avatar'), async (req, res) => {
    try {
        let user = {}
        if (req.file) {

            const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer();
            user = new User({
                username: req.body.username,
                email: req.body.email,
                avatar: buffer,
                password: req.body.password,
                project: req.body.project
            });
        } else {
            user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                project: req.body.project
            });
        }
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
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