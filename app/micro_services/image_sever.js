const express = require('express');
const port = 3333 ;
const app = express();
const jwt = require('jsonwebtoken')
// const db = require("../source/models/index.js");
const multer = require('multer')
const sharp = require('sharp')
const upload = multer({dest : 'uploads/'})
const cors = require("cors");
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

// const userModel = require("../source/models/user.js")
// db.connect();


require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

app.use(cors());

app.use((req,res,next)=> {
    const authorization = req.headers.authorization
    const accessToken = authorization && authorization.split(" ")[1]
    res.locals.accessToken = accessToken ;
    next();
})

//create s3 instance 
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
})
//upload file to s3 
const uploadFileToS3 = (name , path) => {
    const fileStream = fs.createReadStream(path)
    const uploadParams = {
        Bucket : bucketName,
        Body : fileStream,
        Key : name
    }
    return s3.upload(uploadParams).promise()
}
// get file from s3 bucket 
const getFileFromS3 = (fileKey) => {
    try {
        const downloadParams = {
            Key : fileKey , 
            Bucket : bucketName,
        }
        return s3.getObject(downloadParams).createReadStream();
    } catch(err) {
        // console.log(err)
        throw new Error(err)
    }
}
// delete file from s3 bucket 
const deleteFileFromS3 = (fileKey) => {
    const deleteParams = {
        Bucket : bucketName,
        Key : fileKey
    }
    s3.deleteObject(deleteParams, function(err, data) {
        if (err) throw new Error(err) 
        return;
      });
}
// client send request get img 
app.get('/images/:key', async (req,res) => {
    try {
        const fileKey = req.params.key ;
        const readStream = await getFileFromS3(fileKey) ;
        if(!readStream) return res.status(400).json({
            message: "OPPS , HAVE ERROR ",
            success : "false"
        })
        readStream.on('error', err => {
            console.log(err)
            res.status(400).json({
                err : err ,
                message : "OPPS , HAVE ERROR ",
                success: "false"
            })
        }).pipe(res)
    }catch(err){
        // console.log(err)
        res.status(404).json({
            err : err ,
            message: "OPPS , HAVE ERROR ",
            success : "false"
        })
    }
})
// client send request delete img 
app.delete('/images/:key', async (req,res) => {
    const accessToken = res.locals.accessToken ;
    if(!accessToken) return res.status(401).json({
        message : "Unauthorized" ,
        success : "false"
    })
    try {
        const payload = await jwt.verify(accessToken,accessTokenSecret)
        const fileKey = req.params.key ;
        deleteFileFromS3(fileKey)
        res.status(200).json({
            message : "DELETE SUCCESSFULLY",
            success : "true",
        }) ;
    }catch(err){
        console.log(err)
        res.status(404).json({
            err : err ,
            message: "OPPS , HAVE ERROR ",
            success : "false"
        })
    }
})
//client send img to sever and sever resize it in the uploads_resize directory and upload to s3
app.post('/images' , upload.single('image') , async (req,res,next) => {
    const accessToken = res.locals.accessToken ;
    if(!accessToken) return res.status(401).json({
        message : "Unauthorized" ,
        success : "false"
    })
    if(!req.file) return res.status(400).json({ 
            message : "THE FILE IS NULL",
            success : " false",
    })
    try {
        // console.log(req.file)
        await jwt.verify(accessToken,accessTokenSecret)
        const originalName = req.file.originalname
        const filename = req.file.filename
        const filePath = req.file.path
        const resizePath = './uploads_resize/' + filename
        let size = {}
        if(originalName === "avt_pic") {
            size = { width : 200 , height : 200 }
        }
        if(originalName === "banner_pic") {
            size = { width : 1280 , height : 720 }
        }
        fs.access('./uploads' , err => {
            if (err) fs.mkdirSync('./uploads')
        })
        fs.access('./uploads_resize', err => {
            if (err) fs.mkdirSync('./uploads_resize')
        })
        await sharp(filePath).resize(size).toFile(resizePath)
        const result = await uploadFileToS3(filename , resizePath)
        await unlinkFile(filePath)
        await unlinkFile(resizePath)
        // console.log(result)
        res.status(201).json({
            result : result ,
            originalName : originalName ,
            message : "UPLOAD IMG SUCCESSFULLY",
            success: "true",
        }) 
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({
            err : err , 
            message : "OPPS , HAVE ERROR ",
            success : " false",
        })
    }
})

app.listen( port , () => {
    console.log(`image sever is listening at the ${port}`)
})