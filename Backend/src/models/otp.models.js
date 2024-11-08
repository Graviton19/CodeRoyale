import mongoose, {Schema} from "mongoose"
import { mailSender } from "../utils/email.js"

const otpSchema = new Schema(
    {
        email:{
            type: String,
            required: true,
        },
        otp:{
            type: String,
            required: true,
        },
        createdat:{
            type: Date,
            default: Date.now,
            expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
        }
    }
)

//define a function to send emails 

async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(
          email,
          "Verification Email",
          `<h1>Please confirm your OTP</h1>
           <p>Here is your OTP code: ${otp}</p>`
        );
        console.log("Email sent successfully: ", mailResponse);
      } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

otpSchema.pre("save", async function (next) {
    console.log("New document saved to the database");
    // Only send an email when a new document is created
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

export const Otp = mongoose.model("Otp",otpSchema)