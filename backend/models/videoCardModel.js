import mongoose, {Schema}  from "mongoose";

const videoCardSchema = mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    siValue: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required:true
    },
    category: {
        type: String,
        required: true,
        default: "no category"
    },
    highlight:{
        type: Boolean,
        required: true,
        default: false
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    order: {
        type: Schema.Types.Mixed,
        default: undefined
    },
    type: {
        type: String,
        default: "youtube",
        required: true
    }
},
{
    timestamps: true
});

const VideoCard = mongoose.model("VideoCard", videoCardSchema);

export default VideoCard;