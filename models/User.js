const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
        // plain과 hash가 같은지 확인
        bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

userSchema.methods.generateToken = function () {
    return new Promise((resolve, reject) => {
        const user = this;
        const token = jwt.sign(user._id.toHexString(), 'secretToken');
        user.token = token;

        user.save()
            .then(() => resolve(user))
            .catch(err => reject(err));
    });
};

userSchema.statics.findByToken = async function (token) {
  try {
    const decoded = jwt.verify(token, 'secretToken');
    const user = await this.findOne({ _id: decoded, token });
    return user;
  } catch (err) {
    return null;
  }
};


const User = mongoose.model('User', userSchema)

module.exports = { User }