const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var streamSchema = new Schema(
  {
    commentator : {
      type: Schema.Types.ObjectId , 
      ref: 'user' 
    } ,
    match : {
      type: Schema.Types.ObjectId , 
      ref: 'match' 
    }, 
    status : {
      begining : {
        type: Boolean ,
        default : false
      } ,
      finished : {
        type: Boolean ,
        default : false
      } ,
      comming : {
        type: Boolean ,
        default : false
      } ,
    } ,
    linkStream : String ,
    keyStream : String ,
  },
  { timestamps: true }
);


module.exports = mongoose.model("stream", streamSchema)
