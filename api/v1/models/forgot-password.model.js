const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {
        email : String,
        OTP : String,
        expireAt : { // tự động xóa sau x giay
            type : Date,
            expires : 300
        }
    } ,{
        timestamps : true
    }
)
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, 'forgot-password');
module.exports = ForgotPassword;
