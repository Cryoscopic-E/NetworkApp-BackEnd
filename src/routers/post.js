const express = require('express')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const authetication = require('../middlewares/authentication')
const multer = require('multer')
const sharp = require('sharp');

const router = new express.Router();



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

//ADD POST
router.post('/createPost', imageUpload.single('image'), authetication, async (req, res) => {

    let post = {}
    if (req.file) {
        const buffer = await sharp(req.file.buffer).png().toBuffer();

        post = new Post({
            image: buffer,
            text: req.body.text,
            creator: req.user._id
        })
    } else {
        post = new Post({
            text: req.body.text,
            creator: req.user._id
        })
    }


    try {
        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

//FETCH POSTS IN PROJECT
router.get('/getPosts', authetication, async (req, res) => {

    try {
        let posts = await User.getPostsFromProject(req.user.project)
        posts.sort((a, b) => {
            return (a.createdAt > b.createdAt) ? -1 : 1
        })
        res.send(posts);
    } catch (error) {
        return res.status(500).send()
    }
})

//DELETE POST
router.delete('/deletePost/:id', authetication, async (req, res) => {
    try {
        const postToDelete = await Post.findByIdAndDelete({ _id: req.params.id })
        if (!postToDelete) {
            return res.status(404).send()
        }
        res.send(postToDelete)
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;