const app = require('express')
const router = app.Router();
const post_controller = require('../controllers/post.js')
const data_mdw = require("../middlewares/data_mdw.js");

router.post('/:slug?:id',  post_controller.post_get_data)

router.get('/:slug?:id',  data_mdw.retrive_data , post_controller.post_render_view)

router.get('/' , post_controller.posts_render_view)

module.exports = router