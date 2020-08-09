const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const postSchema = new mongoose.Schema({
    title: {type: String, required:true},
    body: {type: String, required:true},
    photo: String,
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ 
        text:String,
        postedBy:{type: Schema.Types.ObjectId, ref: 'User'} 
    }]
},{timestamps:true})

const post = mongoose.model('Post', postSchema)
module.exports = post