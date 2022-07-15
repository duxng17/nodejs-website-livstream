const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var postSchema = new Schema(
  {
    title: String,
    content : String,
    summary : String ,
    banner : String,
    author : {
      type: Schema.Types.ObjectId , 
      ref: 'user' 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", postSchema);
