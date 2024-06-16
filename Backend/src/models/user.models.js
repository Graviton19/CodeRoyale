import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    password: {
        type: String,
        required: false,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [100, 'Password cannot exceed 100 characters']
    },
    state: {
        type: String,
        enum: ['idle', 'finding-match', 'pre-match', 'in-match'],
        default: 'idle'
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        maxlength: [100, 'Email cannot exceed 100 characters']
    },
    refreshToken: String,
    play: { type: mongoose.Schema.Types.ObjectId, ref: 'Play' },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Play' }] // Array to store play session IDs in history
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);
