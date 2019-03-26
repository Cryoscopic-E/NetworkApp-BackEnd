const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isLength(value, {
                    min: 6
                })) {
                throw new Error('Password must be at least 6 chars');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    project: {
        type: String,
        required: true,
        trim: true
    }
});

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({
        _id: this._id.toString()
    }, 'random');
    this.tokens = this.tokens.concat({
        token
    });
    await this.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const userObj = this.toObject();
    delete userObj.password;
    delete userObj.token;
    delete userObj.avatar;
    return userObj;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;

};

userSchema.statics.findByProjectName = async (project) => {
    const users = await User.find({ project });

    if (!users) {
        throw new Error('Unable to fetch users');
    }

    return users;
}


userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({
        owner: user._id
    });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;