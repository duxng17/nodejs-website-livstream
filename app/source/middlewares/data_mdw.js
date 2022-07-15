const streamModel = require('../models/stream.js')
const matchModel = require("../models/match.js");
const postModel = require('../models/post.js');

exports.retrive_data = async (req, res, next) => {
  try {
    const matchesHot = await matchModel
        .find({ "props.hot": true })
        .lean()
        .sort({ timer: 1 });
    const matchesCapableStream = await matchModel
      .find({ "props.stream": true })
      .lean()
      .sort({ timer: 1 });
    const matches = await matchModel
      .find({})
      .lean()
      .sort({ timer: 1 })
      .select("-createdAt -updatedAt -banner -stream -commentator");
    const matchesAvaiableStream = await matchModel
      .find({ stream : {$exists : true }})
      .lean()
      .populate({
          path : 'commentator' ,
          select : 'userId avt'
      })
      .populate({
        path : 'stream', 
        select : 'status',
      })
      .select('-__v -createdAt -updatedAt')
      .sort({timer : 1})
      .limit(3)
    const posts = await postModel
      .find({})
      .lean()
      .sort({createdAt : 1})
      .limit(6)
    res.locals.matchesHot = matchesHot
    res.locals.matchesAvaiableStream = matchesAvaiableStream
    res.locals.matchesCapableStream = matchesCapableStream ; 
    res.locals.matches = matches;
    res.locals.posts = posts;
    next();
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};