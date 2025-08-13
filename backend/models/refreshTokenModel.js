import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        immutable: true,
    }
},
{
    timestamps: true
});

const RefreshTokens = mongoose.model("RefreshTokens", refreshTokenSchema);

export default RefreshTokens;