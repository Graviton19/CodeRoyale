import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            maxlength: [50, "Username cannot exceed 50 characters"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            maxlength: [100, "Password cannot exceed 100 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /\S+@\S+\.\S+/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            },
            maxlength: [100, "Email cannot exceed 100 characters"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: String
    },
    { timestamps: true }
);

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        return false;
    }
};

const User = mongoose.model("User", userSchema);

export default User;
