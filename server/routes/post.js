const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postModel = require('../models/post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allPost', requireLogin, (req, res) => {
    postModel.find().populate('postedBy', 'name')
        .populate("comments.postedBy", "name")
        .sort('-createdAt')
        .then(result => {
            res.status(200).json({ posts: result })
        }).catch(err => {
            console.log(err)
        })
})

router.post('/createPost', requireLogin, function (req, res) {
    const { title, body, pic } = req.body;
    console.log('data: ' + pic)
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "All fields must be filled" })
    } else {

        req.userModel.password = undefined
        const postDetail = new postModel({
            title: title,
            body: body,
            photo: pic,
            postedBy: req.userModel
        })

        postDetail.save().then(result => {
            res.status(200).json({ post: result })
        }).catch(err => {
            console.log(err)
        })
    }

})

router.get('/myPost', requireLogin, (req, res) => {
    postModel.find({ postedBy: req.userModel._id })
        .populate('postedBy', 'name')
        .sort('-createdAt')
        .then(result => {
            res.status(200).json({ MyPost: result })
        }).catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, function (req, res, next) {
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.userModel._id }
    }, {
        new: true
    }).populate('postedBy', 'name')
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, function (req, res, next) {
    postModel.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.userModel._id }
    }, {
        new: true
    }).populate('postedBy', 'name')
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, function (req, res, next) {
    const comment = {
        text: req.body.text,
        postedBy: req.userModel._id
    }
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "name")
        .populate('postedBy', 'name')
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId',requireLogin,(req,res,next)=>{
    postModel.findOne({_id:req.params.postId})
    .populate('postedBy','_id')
    .exec((err,post)=>{
        console.log(post);

        if(err, !post){
            res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.userModel._id.toString()){
            post.remove()
            .then(result=>{
                res.json({result})
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{

    // if postedBy in following
    postModel.find({postedBy:{$in:req.userModel.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
}) 

module.exports = router