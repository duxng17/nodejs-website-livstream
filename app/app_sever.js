const express = require("express");
const path = require("path");
var bodyParser = require('body-parser')
const app = express();
const port = 3000;
const methodOverride = require('method-override')
const cookieParser = require("cookie-parser")
const db = require("./source/models/index.js");
const route = require("./source/routes/route.js");

// db connect
db.connect();
//middleware build-in
app.use(cookieParser('my secret here'))
app.use(methodOverride('_method'));
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//set static path
app.use(express.static(path.join(__dirname, "/source/public")));
// set engine temple : ejs
app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "/source/views"));
app.set("view engine", "html");
// route
route(app);

app.listen(port, () => {
  console.log(`app sever is listening ${port}`);
});
