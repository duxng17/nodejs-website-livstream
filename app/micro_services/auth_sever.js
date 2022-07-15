const express = require("express");
const app = express();
const db = require("../source/models/index.js");
const port = 5555;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../source/models/user.js");
const cors = require("cors");
dotenv.config();
db.connect();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cors());
const generateTokens = (user) => {
    let d = new Date();
    let now = d.getTime();
    const accessToken = jwt.sign({
        email: user.email,
        userId: user.userId,
        role: user.role,
        id: user._id,
        avt: user.avt
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3h",
    });
    const refreshToken = jwt.sign({
        email: user.email,
        userId: user.userId,
        role: user.role,
        id: user._id,
        avt: user.avt
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    let tokens = {
        accessToken: {
            token: accessToken,
            expire: now + 3 * 60 * 60 * 1000,
        },
        refreshToken: {
            token: refreshToken,
            expire: now + 7 * 24 * 60 * 60 * 1000,
        },
    };
    return tokens;
};
const addRefreshToken = async (user, refreshToken) => {
    let newUser = {
        ...user,
        refreshToken: refreshToken,
    };
    try {
        await userModel.updateOne({
            _id: user._id,
        }, newUser);
        return;
    } catch (err) {
        throw new Error(err);
    }
};
const checkRoleUser = (dataUserFormSubmit) => {
    if(dataUserFormSubmit.userId === process.env.MY_SECRET) {
        let newUserModel = {
            ...dataUserFormSubmit,
            role: "admin",
            avt: "/img/admin.png",
        };
        return newUserModel;
    } else {
        let newUserModel = {
            ...dataUserFormSubmit,
            role: "user",
            avt: "/img/avt-2.png"
        };
        return newUserModel;
    }
};
app.post("/login", async (req, res, next) => {
    try {
        let user = await userModel.findOne({
            email: req.body.email,
            password: req.body.password,
        }).lean();
        if(!user) return res.status(404).json({
            err: "user = null",
            success: "false",
            message: "TAI KHOAN HOAC MAT KHAU KHONG DUNG !!",
        });
        let tokens = generateTokens(user);
        addRefreshToken(user, tokens.refreshToken.token);
        res.json({
            loginStatus: "true",
            success: "true",
            userId: user.userId,
            email: user.email,
            role: user.role,
            id: user._id,
            avt: user.avt,
            message: "DANG NHAP THANH CONG !!! ",
            accessToken: {
                token: tokens.accessToken.token,
                expire: tokens.accessToken.expire,
            },
            refreshToken: {
                token: tokens.refreshToken.token,
                expire: tokens.refreshToken.expire,
            },
        });
    } catch (err) {
        res.status(404).json({
            err: err,
            success: "false",
            message: "TAI KHOAN HOAC MAT KHAU KHONG DUNG !!",
        });
    }
});
app.post("/tokens", async (req, res, next) => {
    let refreshToken = req.body.refreshToken;
    if(!refreshToken) return res.status(403).json({
        err: "Refresh Token Null",
        success: "false",
        message: "Phien ban dang nhap da het han , vui long dang nhap lai",
    });
    try {
        let user = await userModel.findOne({
            refreshToken: refreshToken,
        }).lean();
        if(!user) return res.status(404).json({
            err: "Refresh Token NOT FOUND ",
            success: "false",
            message: "Phien ban dang nhap da het han , vui long dang nhap lai",
        });
        jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET,
            (err, payload) => {
                if(err) return res.status(403).json({
                    err: err,
                    success: "false",
                    message: "Phien ban dang nhap da het han , vui long dang nhap lai",
                });
                let tokens = generateTokens(user);
                addRefreshToken(user, tokens.refreshToken.token);
                res.status(201).json({
                    tokens,
                });
            });
    } catch (err) {
        res.status(403).json({
            err: err,
            message: "OPPS , HAVE ERROR ",
        });
    }
});
app.post("/logout", async (req, res, next) => {
    let refreshToken = req.body.refreshToken;
    if(!refreshToken) return res.status(401).json("Refresh Token NULL");
    try {
        let userDeleteRefreshToken = await userModel.findOne({
            refreshToken: refreshToken,
        }).lean();
        if(!userDeleteRefreshToken) return res.status(404).json("Refresh Token Not avalid");
        await userModel.updateOne({
            _id: userDeleteRefreshToken._id,
        }, { $unset : {refreshToken : ""}});
        res.status(200).json("LOGOUT SUCCESSFULLY");
    } catch (err) {
        console.log(err)
        res.status(404).json({
            err: err,
            message: "OPPS , HAVE ERROR ",
        });
    }
});
app.post("/register", async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let userId = req.body.userId;
    let dataUserFormSubmit = req.body
    if(email === "" || password === "" || userId === "") return res.status(400).json({
        err: "EMAIL AND PASSWORD NULL",
        success: "false",
        message: "Đăng kí thất bại !!",
    });
    try {
        let user = await userModel.findOne({
            email: email,
        });
        if(user) return res.status(406).json({
            err: "EMAIL HAVE BEEN REGISTER",
            success: "false",
            message: "EMAIL ĐÃ TỒN TẠI , VUI LÒNG SỬ DỤNG EMAIL KHÁC",
        });
        let newUser = checkRoleUser(dataUserFormSubmit);
        await new userModel(newUser).save();
        res.status(201).json({
            message: "ĐĂNG KÍ TÀI KHOẢN THÀNH CÔNG",
            success: "true",
        });
    } catch (err) {
        res.status(400).json({
            err: err,
            message: "OPPS , HAVE ERROR ",
        });
    }
});
app.post("/auth_stream", async (req, res) => {
    try {
        let streamKey = req.body.key;
        let nameStream = req.body.name;
        const payload = await jwt.verify(streamKey, process.env.MY_SECRET);
        if(payload.id !== nameStream) return res.status(401).send();
        res.status(200).send();
    } catch (err) {
        res.status(403).send();
    }
});
app.listen(port, () => {
    console.log(`auth sever is listening ${port}`);
});
