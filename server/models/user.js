const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    followers:[{ type: Schema.Types.ObjectId, ref: 'User'}],
    following:[{ type: Schema.Types.ObjectId, ref: 'User'}],
    resetToken:String,
    expireToken:Date,
    profile:{type:String, default:"https://res.cloudinary.com/insta-demo/image/upload/v1596783253/blank-profile-picture-973460_1280_v4jkna.webp"}
})

const user = mongoose.model('User', userSchema)
module.exports = user