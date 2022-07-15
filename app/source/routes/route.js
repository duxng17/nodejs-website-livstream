const partialsRouter = require("./partialsRouter.js");
const postRouter = require("./postRouter.js");  
const userRouter = require("./userRouter.js");
const adminRouter = require("./adminRouter.js");
const streamRouter = require("./streamRouter.js");
const auth_mdw = require("../middlewares/auth_mdw.js");
const data_mdw = require("../middlewares/data_mdw.js");

function route(app) {
  app.use("/admin" , auth_mdw.auth_admin_verifyToken , adminRouter )
  app.use("/user" , auth_mdw.auth_user_verifyToken , userRouter )
  app.use("/tin-tuc" , postRouter )
  app.use('/truc-tiep', streamRouter )
  app.use("/", partialsRouter );
  app.use( data_mdw.retrive_data , (req,res) => res.render("error_views/error_404.html") )
}

module.exports = route;
