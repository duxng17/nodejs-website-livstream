const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var matchSchema = new Schema(
  {
    league : String ,
    team1 : {
      fullName : String ,
      shortName : String ,
      logo : String ,
      score : Number ,
      fans : [{type: Schema.Types.ObjectId ,ref: 'user' }]
    },
    team2 : {
      fullName : String ,
      shortName : String ,
      logo : String ,
      score : Number ,
      fans : [{type: Schema.Types.ObjectId ,ref: 'user' }]
    },
    props : {
      stream : {
        type : Boolean , 
        default : false
      } ,
      ft : {
        type : Boolean , 
        default : false
      } ,
      hot : {
        type : Boolean , 
        default : false
      } ,
    },
    commentator : {
      type: Schema.Types.ObjectId ,ref: 'user' 
    },
    stream : {
      type: Schema.Types.ObjectId ,ref: 'stream' 
    },
    banner : String ,
    stadium : String ,
    timer : Date ,
  },
  { timestamps: true }
);

module.exports = mongoose.model("match", matchSchema);
