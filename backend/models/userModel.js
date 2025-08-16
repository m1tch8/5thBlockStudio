import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is Required"]
    },
    email:{
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "Email address already taken"]
    },
    password:{
        type: String,
        required: [true, "Password is Required"]
    },
    role:{
        type: String,
        default: "user"
    }
},
{
    Timestamps: true
});


const User = mongoose.model("User", userSchema);

export default User;