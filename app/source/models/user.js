const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema(
    {
        email : String , 
        userId : String,
        password : String,
        role : String ,
        avt : String ,
        interests : [{
            type: Schema.Types.ObjectId,
            ref: 'match'
        }] ,
        refreshToken : String  
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("user",userSchema)


