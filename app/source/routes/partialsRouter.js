const express = require("express");
const router = express.Router();
const auth_mdw = require("../middlewares/auth_mdw.js");
const data_mdw = require('../middlewares/data_mdw.js')
const fs = require('fs')

router.get("/login" , auth_mdw.validate_status_login , (req,res) => res.render('auth_views/login.html'));
router.get("/high-light", data_mdw.retrive_data ,(req,res) => res.render("non-main_views/high-light.html")); 
router.get("/lien-he", data_mdw.retrive_data  , (req,res) => res.render("non-main_views/lien-he.html"));
router.get("/dieu-khoan", data_mdw.retrive_data  ,(req,res) => res.render("non-main_views/dieu-khoan.html"));
router.get("/ve-chung-toi", data_mdw.retrive_data  ,(req,res) => res.render("non-main_views/ve-chung-toi.html"));
router.get("/chinh-sach-bao-mat", data_mdw.retrive_data  ,(req,res) => res.render("non-main_views/bao-mat.html"));
router.get("/cau-hoi-thuong-gap", data_mdw.retrive_data  ,(req,res) => res.render("non-main_views/cau-hoi.html"));
router.get("/robots.txt", data_mdw.retrive_data  ,(req,res) => fs.readFile(__dirname + "/public/robots.txt") );
router.get("/sitemap.xml",data_mdw.retrive_data  ,(req,res) => fs.readFile(__dirname + "/public/sitemap.xml") );
router.get("/error",data_mdw.retrive_data  ,(req,res) => res.render("error_views/error_404.html"))
router.get("/",  data_mdw.retrive_data ,(req,res) => res.render("home_views/home.html") );

module.exports = router;
