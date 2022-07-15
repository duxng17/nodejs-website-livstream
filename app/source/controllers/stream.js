
const streamModel = require("../models/stream.js");
const matchModel = require("../models/match.js");

exports.streams_render_view = (req, res, next) => {
  res.render('stream_views/streams.html' )
}
exports.stream_render_view = async (req, res, next) => {
  res.setHeader(
    "Set-Cookie",
    "cross-site-cookie=whatever; SameSite=None; Secure"
  );
  try {
    const match = await matchModel
    .find({_id : req.query.id , 'commentator' : { $exists : true }} )
    .lean()
    .populate({
      path : 'commentator',
      select : 'userId avt'
    })
    if(!match[0]) return res.redirect(404,'/')
    res.render('stream_views/stream.html', { match : match[0] } )
  }catch(err){
    console.log(err)
    res.redirect(404,'/')
  }
};

exports.retrive_data_stream = async (req, res, next) => {
  try {
    const data = await matchModel
    .findById(req.query.id)
    .lean()
    .populate({
      path : 'stream',
      select : 'linkStream status'
    })
    .select('banner timer props')
    if(!data) return res.status(404).json({
      success : "false" ,
      message : 'NOT FOUND DATA STREAM'
    }) 
    res.status(200).json({
      success : "true" ,
      timer : data.timer , 
      banner : data.banner , 
      linkStream : data.stream.linkStream , 
      props : data.props ,
      statusStream : data.stream.status 
    })
  } catch(err){
    console.log(err)
    res.status(404).json({
      err : err.message , 
      message : 'OPPS , HAVE ERROR ' ,
      success : 'false'
    })
  }
};