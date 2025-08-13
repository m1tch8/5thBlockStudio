import mongoose from "mongoose"

const tokenBlackListSchema = mongoose.Schema({
    token: {
        type: String,
        immutable: true
    }
},
{
    timestamps: true
})

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlackListSchema);

export default TokenBlacklist;
