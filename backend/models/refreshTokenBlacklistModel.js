import mongoose from "mongoose";

const refreshTokenBlacklistSchema = mongoose.Schema({
    token: {
        type: String,
        immutable: true
    }
},
{
    timestamps: true
})

const RefreshTokenBlacklist = mongoose.model("RefreshTokenBlacklist", refreshTokenBlacklistSchema);

export default RefreshTokenBlacklist;