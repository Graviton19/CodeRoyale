import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        }
    },{timestamps: true}
)


userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.passsword)
}

export const User = mongoose.model("User",userSchema)
