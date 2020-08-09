var jwt = require('jsonwebtoken');
const userSecret = require('../routes/auth')
const mongoose =  require('mongoose')
const userModel = require('../models/user')
const secter = 'qwertyuio'

module.exports = (req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization) {
       return res.status(401).json({error: "You must be login."})
    }
    const token =  authorization.replace('Bearer ',"")
     jwt.verify(token,secter,(err,payload)=>{
         if(err) {
           return res.status(401).json({error: "You must be login first"})
         }
         const {_id} = payload
         userModel.findById(_id).then(userData=>{
             req.userModel = userData
             next()
         })
         
     })

}