const mongoose=require('mongoose');
const mongoURL="mongodb+srv://vk88732471:hzqsvqrIE4D5erq5@cluster0.fgux9of.mongodb.net/";
const connectToMongo =()=>{
    mongoose.connect(mongoURL)
       . then(()=>{
        console.log("Successfully connected to Mongo");
    }).catch((error)=>{
        console.log(error);
    })

}
module.exports = connectToMongo;