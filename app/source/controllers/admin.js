const postModel = require('../models/post.js')
const userModel = require("../models/user.js");
const matchModel = require("../models/match.js")
const streamModel = require("../models/stream.js")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const generateKeyStream = (id) => {
    const keyStream = jwt.sign({
        id: id,
    }, process.env.MY_SECRET, {
        expiresIn: "3h",
    });
    return keyStream;
};
exports.render_view = async (req, res, next) => {
    try {
        const matchesUserStream = await matchModel
            .find({commentator : res.user.id})
            .lean()
            .populate({
                path : 'commentator',
                select : 'userId avt'
            })
            .select('-createdAt -updatedAt -__v ')
            .sort({timer : 1})
        if(!matchesUserStream) return res.redirect(404,'/')
        const matchesSelectToStream = await matchModel
            .find({stream : { $exists:false }})
            .lean()
            .sort({timer : 1})
        if(!matchesUserStream) return res.redirect(404,'/')
        res.render("admin_views/admin.html" , {matchesUserStream : matchesUserStream , matchesSelectToStream : matchesSelectToStream});
    }catch(err){
        console.log(err.message)
        res.redirect(404,'/')
    }
};

exports.detail_match = async (req,res,next ) => { 
    try {
        const match = await matchModel
        .findOne({_id : req.query.id })
        .lean()
        if(!match) return res.redirect(404,'/')
        res.render('admin_views/detail-match.html' , {match : match})
    }catch(err){
        console.log(err)
        res.redirect(404, '/')
    }
}
exports.add_match = async (req, res, next) => {
    // console.log(req.body)
    try {
        let newMatch = await new matchModel(req.body) ; 
        await newMatch.save()
        res.status(201).json({
            message : "ADD MATCH SUCCESSFULLY",
            success : "true"
        })
    } catch(err) {
    res.status(400).json({
        err: err.message ,
        message: "OPPS , HAVE ERROR ",
        success: "false" ,
    });
    }
};
exports.update_match = async (req,res,next) =>  {
    try {
        await matchModel.updateOne({_id : req.query.id} , req.body)
        res.status(201).json({
            success : 'true' ,
            message : 'update match successfully'
        })
    }catch(err) {
        console.log(err)
        res.status(404).json({ 
            err : err.message , 
            success : 'true' ,
            message : 'opps , have err '
        })
    }
}
exports.delete_match = async (req,res,next) => {
    try {
        const match = await matchModel.findById(req.body.id)
        if(!match) return res.redirect(404,'/')
        if(match.banner) {
            await axios({
                method : 'delete' ,
                url : match.banner , 
                headers : {
                    "Authorization" : 'Bearer' + " " + req.cookies.accessToken_xembong365
                }
            })
        }
        await matchModel.deleteOne({ _id : req.body.id })
        await streamModel.deleteOne({ match : req.body.id })
        res.redirect('/admin')
    } catch(err){
        console.log(err.message)
        res.redirect(404,'/')
    }
}
exports.create_stream = async (req, res, next) => {
    const commentatorId = res.user.id
    const matchId = req.body.id
   try {
    let newStream = new streamModel();
    let keyStream = await generateKeyStream(newStream.id) ;
    let linkStream = `/hls/${newStream.id}/index.m3u8` ;
    newStream = {
        ...newStream._doc ,
        commentator : commentatorId , 
        match : matchId ,
        linkStream : linkStream ,
        keyStream : keyStream ,
    }
    let stream = await new streamModel(newStream).save() ;
    await matchModel.updateOne({ _id:matchId }, {stream : stream.id , commentator : commentatorId , 'props.stream' : true })
    res.redirect('/admin')
   } catch (err) {
     console.log(err)
     res.redirect(404,'/')
   }
}
exports.detail_stream = async (req, res, next) => {
   try {
    const stream = await streamModel
        .findOne({match : req.query.id })
    if(!stream) return res.redirect(404,'/')
    let newKeyStream = await generateKeyStream(stream.id) ;
    stream.keyStream = newKeyStream 
    await stream.save()
    res.render('admin_views/detail-stream.html', {stream : stream})
   }catch(err){
        console.log(err.message)
        res.redirect(404,'/')
   }
};
exports.unsub_stream =  async (req,res,next) => {
    const matchId = req.body.id
   try {
    await streamModel.deleteOne({ match : matchId }) ,
    await matchModel.updateOne({_id : matchId} , { $unset : {commentator : "" , stream : "" } , 'props.stream' : false } )
    res.redirect('/admin')
   } catch (err) {
     console.log(err.message)
     res.redirect(404,'/')
   }
}
exports.update_stream = async (req, res, next) => {
    let data = req.body 
    switch(data.status) {
        case 'comming' : 
        data.status =  {
            comming : true ,
            begining : false ,
            finished : false ,
        };   
        break;
        case 'begining' : 
        data.status =  {
            comming : false ,
            begining : true ,
            finished : false ,
        }; 
        break ;
        case 'finished' : 
        data.status =  {
            comming : false ,
            begining : false ,
            finished : true ,
        }; 
        break ;
    }
    try {
        await streamModel.updateOne({_id : req.query.id } , data )
        res.redirect('/admin')
    }catch(err){
         console.log(err.message)
         res.redirect(404,'/')
    }
 };


exports.detail_post = async (req,res,next) => {
    // console.log('ok')
    try{
        const post = await postModel.findById(req.query.id).lean()
        if(!post) return res.redirect(404,'/')
        res.render('admin_views/detail-post.html', { post : post })
    }catch(err){
        console.log(err.message)
        res.redirect(404,'/')
    }
}
exports.update_post = async  (req,res,next) => {
    // console.log(req.body)
    try{
        await postModel.updateOne({_id : req.query.id } , req.body) 
        res.status(201).json({
            success : 'true' ,
            message : 'update match successfully'
        })
    }catch(err){
        console.log(err)
        res.status(404).json({ 
            err : err.message , 
            success : 'true' ,
            message : 'opps , have err '
        })
    }
}
exports.delete_post = async ( req , res , next ) => {
    try {
        const post = await postModel.findById(req.body.id)
        if(!post) return res.redirect(404,'/')
        if(post.banner) {
            await axios({
                method : 'delete' ,
                url : post.banner , 
                headers : {
                    "Authorization" : 'Bearer' + " " + req.cookies.accessToken_xembong365
                }
            })
        }
        await postModel.deleteOne({ _id : req.body.id })
        res.redirect('/admin')
    } catch(err){
        console.log(err.message)
        res.redirect(404,'/')
    }
}
exports.add_post = async (req, res, next) => {
    try {
        req.body.author = res.user.id 
        // console.log(req.body)
        let newPost = await new postModel(req.body) ; 
        await newPost.save()
        res.status(201).json({
            message : "ADD POST SUCCESSFULLY",
            success : "true"
        })
    } catch(err) {
    res.status(400).json({
        err: err.message ,
        message: "OPPS , HAVE ERROR ",
        success: "false" ,
    });
    }
 }

 exports.update_user = async (req,res,next ) => {
     try{
        await userModel.updateOne({_id : req.query.id} , req.body)
        res.redirect('/admin')
     }catch ( err ) {
        console.log(err)
        res.redirect(404,'/')
     }
  }

 exports.search_user =  async (req,res,next) => {
   try {
    const user = await userModel.findOne({ email : req.body.email }).lean()
    if(!user) return res.redirect(404,'/')
    res.render('admin_views/detail-user.html' , {user : user})
   }catch(err){
    console.log(err)
    res.redirect(404,'/')
   }
 } 
 exports.delete_user = async (req,res,next ) => {
     try{
        const user = await userModel.findOne({_id : req.body.id })
        if(!user) return res.redirect(404,'/')
        if(user.avt !== '/img/avt-2.png' && user.avt !== '/img/admin.png') {
            axios({
                method : 'delete',
                url : user.avt ,
                headers : {
                    "Authorization" : 'Bearer' + " " + req.cookies.accessToken_xembong365
                }
            })
        }
        await user.deleteOne({ _id : req.body.id})
        res.redirect('/admin')
     }catch(err){
        console.log(err)
        res.redirect(404,'/')
    }
 }
