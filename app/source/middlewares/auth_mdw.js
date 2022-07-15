const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.auth_admin_verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken_xembong365;
  if (!accessToken) return res.redirect(403,"/login");
  try {
    const payload = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    res.user = payload 
    if (payload.role !== "admin") return res.redirect(403,"/") ;
    next();
  } catch (err) {
    // console.log(err)
    res.redirect("/");
  }
};
exports.auth_user_verifyToken = async (req,res,next) => {
  const accessToken = req.cookies.accessToken_xembong365;
  if (!accessToken) return res.redirect(403,"/login");
  try {
    const payload = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    res.user = payload 
    next();
  } catch (err) {
    console.log(err)
    res.redirect("/");
  }
}
exports.validate_status_login = (req,res,next) => {
  const accessToken = req.cookies.accessToken_xembong365;
  if (accessToken) return res.redirect("/");
  next();
}