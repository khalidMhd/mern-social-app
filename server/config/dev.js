const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/Insta-Demo',
mongoose.connect('mongodb://admin:instademo1234@instademo-shard-00-00.j1zik.mongodb.net:27017,instademo-shard-00-01.j1zik.mongodb.net:27017,instademo-shard-00-02.j1zik.mongodb.net:27017/InstaDemo?ssl=true&replicaSet=atlas-b6yqxg-shard-0&authSource=admin&retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true,});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database Connected")
});
module.exports = db