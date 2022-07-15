const app = require('express');
const router = app.Router();
const admin_controller = require('../controllers/admin.js')
const data_mdw = require("../middlewares/data_mdw.js");


router.post('/update-post?:id' , admin_controller.update_post)

router.post('/update-stream?:id' , admin_controller.update_stream)

router.post('/update-match?:id' , admin_controller.update_match)

router.post('/update-user?:id' , admin_controller.update_user)

router.get('/detail-match?:id' , data_mdw.retrive_data , admin_controller.detail_match)

router.get('/detail-stream?:id' , data_mdw.retrive_data , admin_controller.detail_stream)

router.post('/search-user' , data_mdw.retrive_data , admin_controller.search_user )

router.get('/detail-post?:id' ,  data_mdw.retrive_data , admin_controller.detail_post)

router.post('/add-post' , admin_controller.add_post)

router.post('/create-stream' , admin_controller.create_stream)

router.post('/add-match' , admin_controller.add_match)

router.delete('/delete-match' , admin_controller.delete_match)

router.delete('/unsub-stream' , admin_controller.unsub_stream )

router.delete('/delete-post' , admin_controller.delete_post)

router.delete('/delete-user' , admin_controller.delete_user)

router.get('/', data_mdw.retrive_data ,admin_controller.render_view)


module.exports = router 