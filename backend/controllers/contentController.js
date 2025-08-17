import asyncHandler from "express-async-handler"
import VideoCard from "../models/videoCardModel.js"
import streamifier from 'streamifier'
import cloudinary from "../config/cloudinary.js"


//GET
//Getting data of VideoCard
export const getVideoCard = asyncHandler(async (req,res)=>{

    const query = req.query
    const bool = "true"
    
    if (query.highlight){
        query.highlight = bool === query.highlight //This will convert the boolean string("true"/"false") to real Boolean
    }

    let vCards

    if (query.highlight){
        vCards = await VideoCard.find(query).sort({order: 1, createdAt: -1})
    }
    else{
        vCards = await VideoCard.find().sort({order: 1, createdAt: -1})
    }
    if(!vCards){
        res.status(404)
        throw new Error("Not Found")
    }
    res.json(vCards)
})

//GET
//Individual VideoCard
export const IndividualVideoCard = asyncHandler(async (req,res)=>{
    
    const vCards = await VideoCard.findById(req.params.id)
    if(!vCards){
        res.status(404)
        throw new Error("Video Cards not Found")
    }
    res.json(vCards)
})

//GET
//Limits the number of cards in response
export const limitVideoCard = asyncHandler(async(req, res) => {
    const {limit} = req.params

    // Will throw error if the parameter 'limit' is not a number
    if (isNaN(Number(limit))) {
        res.status(400)
        throw new Error("Parameter must be a number")
    }
    const vCards = await VideoCard.find().limit(limit)
    const count = await VideoCard.countDocuments()
    res.json({
        maxLimit: count,
        vCards
    })
})

//POST
//Create Video Card
export const createVideoCard = asyncHandler(async (req,res)=>{
    const data = req.body
    data.type = "youtube"
    
    try{
        const videoCard = await VideoCard.create(data)
        res.status(200).json({
        success: true,
        videoCard
    })
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
    
});

    
export const uploadVideo = asyncHandler(async (req,res)=>{
    const file = req.file
    const {title, category} = req.body;
    
    if (!title || !category){
        res.status(400)
        throw new Error("All fields are required")
    }
    if (!file){
        throw new Error("No video uploaded or wrong file type.")
    }
    try {
        
        const stream = cloudinary.uploader.upload_stream({
            resource_type: 'video', // Important for videos
        },
        async(error, result) => {
            if (error) {
                console.error('Cloudinary error:', error);
                return res.status(500).send('Upload failed.');
            }
            // Generate optimized URL using transformation
            const optimizedUrl = cloudinary.url(result.public_id, {
                resource_type: 'video',
                transformation: [
                    { quality: 'auto:eco', fetch_format: 'auto', width: 720 }
                ]
            });

            const videoCard = await VideoCard.create({
                title,
                category,
                videoId: optimizedUrl,
                siValue: result.public_id,
                type: "file"
            })
            res.status(200).json({
                success: true,
                videoCard
            })
        });
        // Pipe buffer to cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
        
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send('Unexpected server error.');
    }
});


//PUT
//UPDATE VideoCards
export const updateVideoCard = asyncHandler(async (req,res)=>{
    const {id} = req.params
    const {highlight} = req.query

    if (highlight && highlight === "true"){
        
        const videoCard = await VideoCard.findById(id)
        
        if(videoCard.highlight === false){
            //Find Order that is not null so that its order will be set to a number
            const lastOrderVideoCard = await VideoCard.findOne({
                    'order': { $ne: "null" }
                })
                .sort({'order': -1})
                .select('order')
            //if there is still no order set, it will set to 1
            if(!lastOrderVideoCard){
                videoCard.order = 1
            }
            else{
                //If there are others that has orders, it will find the largest value
                videoCard.order = lastOrderVideoCard && lastOrderVideoCard.order + 1
            }
        }
        else{
            videoCard.order = "null"
        }
        videoCard.highlight = !videoCard.highlight
        videoCard.save()

        res.status(200).json(videoCard)
        return
    }
    
    if(!id){
        res.status(404)
        throw new Error("Id parameter is required")
    }
    try{
        await VideoCard.findByIdAndUpdate(
        id,
        req.body
    )
    }
    catch(err){
        res.status(404)
        throw new Error("Video Card not found")
    }
    const newVideoCard = await VideoCard.findById(id)

    res.status(200).json(newVideoCard)
})

//DELETE
//Delete a Card
export const deleteVideoCard = asyncHandler(async (req,res)=>{
    const id = req.params.id
    
    const vidCard = await VideoCard.findById(id).select('siValue type');

    if(!vidCard){
        res.status(404)
        throw new Error("Vid card not found")
    }
    const {type, siValue} = vidCard;
    
    if(type === "file"){
        try{
            const result = await cloudinary.uploader.destroy(siValue, {
                resource_type: 'video',
                invalidate: true
            });

            if (result.result === 'not found') {
                res.status(404)
                throw new Error("Video not found")
            }
        }
        catch(err){
            res.status(500)
            console.error('Cloudinary error: ', err)
            throw new Error("Failed to delete video from Cloudinary")
        }
    }
    const deletedCard = await VideoCard.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        deletedCard
    })
})

export default getVideoCard