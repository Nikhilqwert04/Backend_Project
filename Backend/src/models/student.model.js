const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

let UserSchema = new mongoose.Schema({
    avatar: {
        type: {
            url: String,
            path: String
        },
        default: {
            url: `https://placehold.co/200x200`,
            localpath: "",
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        trime: true
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshtoken: {
        type: String
    },
    forgotPaswwordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    emailVerficationToken: {
        type: String
    },
    emailVerficationExpiry: {
        type: Date
    }
}, {
    timeStamp: true
})

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

UserSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

UserSchema.methods.generateRefreshToken = function () {
        return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

UserSchema.methods.generateTemporaryToken = function(){
    const unHashedToken =crypto.randomBytes(20).toString("hex")

    const HashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")
    
    const tokenExpiry = Date.now()+(20*60*1000) //20 mins
    return{unHashedToken,HashedToken,tokenExpiry}
}

const StudentModel = mongoose.model('User', UserSchema)

module.exports = StudentModel