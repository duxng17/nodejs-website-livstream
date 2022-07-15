const app = require('express')
const router = app.Router();
const stream_controller = require('../controllers/stream.js')
const data_mdw = require("../middlewares/data_mdw.js");

router.post('/:slug?:id',stream_controller.retrive_data_stream)

router.get('/:slug?:id',  data_mdw.retrive_data ,stream_controller.stream_render_view)

router.get('/', data_mdw.retrive_data , stream_controller.streams_render_view)

module.exports = router