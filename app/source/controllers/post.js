const postModel = require('../models/post.js')
const matchModel = require('../models/match.js')
exports.posts_render_view = async (req, res, next) => {
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
      res.locals.matchesHot = matchesHot
      res.locals.matchesAvaiableStream = matchesAvaiableStream
      res.locals.matchesCapableStream = matchesCapableStream ; 
      res.locals.matches = matches;
      res.locals.posts = posts;
      res.render('post_views/posts.html')
    } catch (err) {
      console.log(err.message);
      next(err);
    }
};

exports.post_render_view = (req, res, next) => {
  postModel
    .findOne({ _id : req.query.id }).lean().populate({ path : 'author' , select : 'userId avt'})
    .then((data) => {
      if (data) {
        res.render("post_views/post.html", { post: data });
      } else {
        res.render('error_views/error_404.html');
      }
    })
    .catch((err) => {
      res.render('error_views/error_404.html')
      next(err);
    });
};

exports.post_get_data = (req, res, next) => {
    postModel
      .findOne({ _id : req.query.id })
      .then((data) => {
        if (data) {
          res.status(200).json({
            success : "true",
            data : data,
          });
        } else {
          res.render('error_views/error_404.html');
        }
      })
      .catch((err) => {
        res.render('error_views/error_404.html')
        next(err);
      });
  };