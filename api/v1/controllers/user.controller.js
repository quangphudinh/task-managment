const md5 = require('md5');
const User = require('../models/user.model');
const ForgotPassword = require('../models/forgot-password.model');

const generateHelper = require('../../../helpers/generate'); 
const sendMailHelper = require('../../../helpers/sentMail');


//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        })
        if (existEmail) {
            res.json({
                code: 400,
                message: 'Email đã tồn tại'
            });
        } else {
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                token: generateHelper.generateRandomString(20)
            });
            await user.save();
            const token = user.token;
            res.cookie('token', token);

            res.json({
                code: 200,
                message: 'Đăng ký thành công',
                token : token
            });
        }

    } catch (error) {
        res.json(error);
    }
}

//[POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: 'Email khong tồn tại'
        });
        return;
    }

    if (md5(password) !== user.password) {
        res.json({
            code: 400,
            message: 'Mật khẩu không đúng'
        });
        return;
    }

    const token = user.token;
    res.cookie('token', token);

    res.json({
        code: 200,
        message: 'Đăng nhập thành công',
        token : token
    });
}

//[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    
    if (!user) {
        res.json({
            code: 400,
            message: 'Email khong tồn tại'
        });
        return;
    }

    //Tạo OTP và lưu vào DB
    const otp = generateHelper.generateRandomNumber(4);
    const objectForgotPassword = {
        email : email,
        OTP : otp,
        expireAt : Date.now()
    }
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    //Gửi OTP qua Email cho User
    const subject = "Mã OTP xác minh Email của bạn !!"
    const html = `
        <h1>Mã OTP của bạn là : <b>${otp}</b></h1>
        <p>Mã OTP sẽ hết hiệu lực sau 5 phút</p><br>
        <p>Vui lòng không cung cấp mã OTP cho bất kỳ ai</p>
    `
    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: 'Gửi OTP thành công qua Email'
    });
}

//[POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email : email,
        OTP : otp
    })
    if (!result) {
        res.json({
            code: 400,
            message: 'OTP đã hết hiệu lực'
        });
        return;
    }

    const user = await User.findOne({
        email : email
    })
    const token = user.token;
    res.cookie('token', token);

    res.json({
        code: 200,
        message: 'Xác minh thành công !!',
        token : token
    })
}

//[POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password;

    const user = await User.findOne({
        token : token
    })

    if(md5(password) == user.password) {
        res.json({
            code: 400,
            message: 'Mật khẩu mới phải khác mật khẩu cũ'
        });
        return;
    }

    await User.updateOne({
        token : token
    }, {
        password : md5(password)
    })

    res.json({
        code: 200,
        message: 'Đặt lại mật khẩu thành công'
    })

}

//[GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
    res.json({
        code: 200,
        message: 'Lấy thông tin thành công',
        user : req.user
    });
}