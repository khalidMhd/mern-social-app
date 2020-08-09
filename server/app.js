const express = require('express');
const app = express();
const mongoose = require('mongoose')
const db = require('./config/mongoose')
const userModel = require('./models/user')
const PORT =process.env.PORT || 5000

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log('Port is running on PORT: ' , PORT)
})