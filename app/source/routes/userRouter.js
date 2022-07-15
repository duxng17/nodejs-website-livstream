const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user.js");
const data_mdw = require("../middlewares/data_mdw.js");

router.post("/profile_update_password" , user_controller.update_password)

router.post("/profile_delete_account" , user_controller.delete_account)

router.post("/profile_update_avt", user_controller.update_avt_user)

router.post("/profile_update_email", user_controller.update_email)

router.post("/profile_update_userId", user_controller.update_userId)

router.post("/profile",user_controller.retrive_data_user);

router.get("/profile",data_mdw.retrive_data ,user_controller.user_view_profile);

module.exports = router;