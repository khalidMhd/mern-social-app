const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const userModel = require('../models/user')
const postModel = require('../models/post')
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:id',requireLogin,(req,res,next)=>{
    userModel.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         postModel.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    userModel.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.userModel._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      userModel.findByIdAndUpdate(req.userModel._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

router.put('/unfollow',requireLogin,(req,res)=>{
    userModel.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.userModel._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      userModel.findByIdAndUpdate(req.userModel._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    userModel.findByIdAndUpdate(req.userModel._id,{$set:{profile:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    userModel.find({email:{$regex:userPattern}})
    .select("email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router