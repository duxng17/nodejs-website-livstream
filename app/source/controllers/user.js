const userModel = require('../models/user.js')

exports.user_view_profile = async (req,res,next) => {
  const userDecoded = res.user
  try {
    const user = await userModel.findOne({
      _id : userDecoded.id 
    }).lean()
    if(!user) return res.render('error_views/error_404.html')
    res.render('user_views/profile.html');
  } catch(err) {
    res.render('error_views/error_404.html')
  }
}
exports.retrive_data_user = async (req,res,next) => {
  const userDecoded = res.user 
  try {
    const user = await userModel.findOne({
      _id : userDecoded.id
    }).lean()
    if(!user) return res.status(404).json({
      success : "false",
      message : "KHÔNG TÌM THẤY PROFILE"
    })
    res.status(200).json({
      email : user.email,
      role : user.role ,
      avt : user.avt ,
      userId : user.userId,
      id : user._id
    })
  } catch(err) {
    res.status(400).json({
      err : err ,
      success : "false",
      message : "có gì đó sai sai"
    })
  }
} 
exports.update_avt_user = async (req,res,next) => {
  const userDecoded = res.user
  try {
    await userModel.updateOne({_id : userDecoded.id} , {avt : req.body.avt})
    res.status(200).json({
      success : "true",
      message : "USER UPDATE AVTATAR SUCCESSFULLY"
    })
  } catch(err){
    // console.log(err)
    res.status(400).json({
      success : "false",
      message : "OPPS , HAVE ERROR "
    })
  }
}
exports.update_userId = async (req,res,next) => {
  const userDecoded = res.user
  try {
    await userModel.updateOne({_id : userDecoded.id} , {userId : req.body.userId}) 
    res.status(200).json({
      success : "true",
      message : "USER UPDATE USER ID SUCCESSFULLY"
    })
  } catch(err){
    // console.log(err)
    res.status(400).json({
      success : "false",
      message : "OPPS , HAVE ERROR "
    })
  }
}
exports.update_email = async (req,res,next) => {
  const userDecoded = res.user
  try {
    const user = await userModel.findOne({email : req.body.email}).lean()
    if(user) return res.status(403).json({
      success : "false",
      message : "EMAIL ĐÃ TỒN TẠI"
    })
    await userModel.updateOne({_id : userDecoded.id} , {email : req.body.email}) 
    res.status(200).json({
      success : "true",
      message : "UPDATE EMAIL SUCCESSFULLY"
    })
  } catch(err){
    // console.log(err)
    res.status(400).json({
      success : "false",
      message : "OPPS , HAVE ERROR "
    })
  }
}
exports.delete_account = async (req,res,next) => {
  const userDecoded = res.user
  try {
    await userModel.deleteOne({_id : userDecoded.id})
    res.status(200).json({
      message : "DELETE ACCOUNT SUCCESSFULLY",
      success : "true"
    })
  }catch(err) {
    console.log(err)
    res.status(400).json({
     err : err ,
     success : "false",
     message : "OPPS , HAVE ERROR "
   })
  }
}
exports.update_password = async (req,res,next) => {
  const userDecoded = res.user
  try {
    const user = await userModel.findOne({_id : userDecoded.id , password : req.body.passwordCurrent}).lean()
    if(!user) return res.status(403).json({
      message : "MẬT KHẨU HIỆN TẠI KHÔNG ĐÚNG " ,
      success : "false"
    })
    await userModel.updateOne({_id : userDecoded.id }, {password : req.body.passwordAfter})
    res.status(200).json({
      message : "UPDATE PASSWORD SUCCESSFULLY",
      success: "false"
    })
  }catch(err){
     console.log(err)
     res.status(400).json({
      err : err ,
      success : "false",
      message : "OPPS , HAVE ERROR "
    })
  }
}