const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const userModel = require('../models/user')
var bcrypt = require('bcryptjs');
const crypto = require('crypto')


var jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin');
const user = require('../models/user');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const secter = 'qwertyuio'
                           
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "your emain",
            pass: 'password'
        }
    });

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body

    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" })
    } else {
        userModel.findOne({ email: email }).then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already Exist with that email" })
            } else {
                bcrypt.hash(password, 12).then(hashPassword => {
                    const userDetails = new userModel({
                        email,
                        password: hashPassword,
                        name,
                        profile:pic
                    })

                    userDetails.save()
                    .then(user => {
                        transporter.sendMail({
                            to:user.email,
                            subject:"signup success",
                            html:"<h1>welcome to instagram</h1>"
                         })
                        res.status(200).json({ message: "Saved Successfully" })
                    }).catch(err => {
                        console.log(err)
                    })
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
})

router.post('/signin', function (req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ err: "Please fill all the fields" })
    } else {
        userModel.findOne({ email: email }).then(savedUser => {
            if (savedUser) {
                if (!savedUser) {
                   return res.status(422).json({ err: "Invalid Emial or Password" })
                }
                bcrypt.compare(password, savedUser.password).then(doMatch => {
                    if (doMatch) {
                        // res.status(200).json({message:"Login Succesfully"})
                        const token = jwt.sign({ _id: savedUser._id }, secter)
                        const {_id, name, email, followers, following,profile} =savedUser
                        res.json({ token, user:{_id, name, email, followers, following,profile} })
                    } else {
                        return res.status(422).json({ err: "Invalid Emial or Password" })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log("errrrrrr"+err)
        }
        const token = buffer.toString("hex")
        userModel.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    // from:"no-replay@insta.com",
                    subject:"password reset",
                    html:`
                     <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    userModel.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router
