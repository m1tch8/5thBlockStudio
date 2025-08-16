import { useState, useEffect } from "react"
import LoadingScreen from "../Components/LoadingScreen"
import useAuth from "../Hooks/useAuth"
import useAPI from "../Hooks/useAPI"
import StatusModal from '../Components/StatusModal'


function YoutubeSection({contentFieldsRef, setIsLoading}){
    const [fields, setFields] = useState(contentFieldsRef.current) // auto saves values in fields even when page changes
    const [open, setOpen] = useState(false)                // set open for Snackbar Alert
    const [statusMessage, setStatusMessage]= useState()    // set Snackbar Alert Message
    const [isError, setIsError] = useState()               // Checks if there is error in submission
    const {accessToken, logout, refresh} = useAuth()
    const api = useAPI()

    //clear fields after submission success
    function clear(){
        contentFieldsRef.current = {
            embedLink: '',
            title: '',
            category: '',
            videoId: '',
            siValue: ''
        }
        setFields(contentFieldsRef.current)
    }

    //content submission function
    async function submitNewContent(){

        setIsLoading(true) //Sets Loading screen

        
        let statusError
        let x = 2 //loop runs for 2 times if token expires

        do{
            let token = statusError === 401 ? await refresh() : accessToken
            //Creates content data from API
            await api.post("/content", fields, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                }
            })
            .then(response =>{
                console.log(response.data)
                clear()
                setStatusMessage("Content has been added successfully.")
                setIsError(false)
                x-- // This stops the loop as the request succeed
            })
            .catch(err=> {
                let errMessage = err.response?.data.message
                statusError = err.response.status
                console.error(errMessage)

                if (!statusError === 401){
                    x-- // stops the loop if there's no error
                }
                if (statusError === 401 && x === 1){
                    logout()   //Logouts after the request takes two Unauthorized request
                                //This means it is unable to generate new accessToken
                                //Refresh token expired or didn't exist
                }
                else{
                    //sets status message to be displayed in the Snackbar Alert
                    if (errMessage.includes("validation failed")){
                        if(!fields.siValue && !fields.videoId && fields.category && fields.title && fields.embedLink){
                            setStatusMessage("Invalid Embeded Link")
                        }
                        else{
                            setStatusMessage("All fields are required.")
                        }
                    }
                    else if (errMessage.includes("duplicate key")){
                        setStatusMessage("Content is already been added")
                    }
                    else{
                        setStatusMessage("There is an internal error.")
                    }
                }

                setIsError(true)
            })

          x--  
        }while (x > 0)
        
        
        setIsLoading(false) //Stops the loading screen
        setOpen(true) //Opens Snackbar Alert for submission status
    }

    //Triggers Submission
    function submitHandle(e){
        e.preventDefault()
        submitNewContent()
    }

    //Embed field On-change
    function embedOnChange(e){

        contentFieldsRef.current.embedLink = e.target.value
        let ytEmbed = e.target.value
        let srcMatch = ytEmbed.match(/src="([^"]+)"/)
        if (srcMatch && srcMatch[1]) {
            const srcUrl = srcMatch[1]

            // Extract video ID from the path
            const videoIdMatch = srcUrl.match(/embed\/([a-zA-Z0-9_-]+)/)
            const vidId = videoIdMatch ? videoIdMatch[1] : null
            contentFieldsRef.current.videoId = vidId
            // Extract `si` query param using URL API
            const url = new URL(srcUrl)
            const siVal = url.searchParams.get('si')
            contentFieldsRef.current.siValue = siVal

            setFields({... fields, videoId: vidId, siValue: siVal, embedLink: e.target.value})
        }
        else{
            contentFieldsRef.current.videoId = ''
            contentFieldsRef.current.siValue = ''
            setFields({...fields, videoId: '', siValue: '', embedLink: e.target.value})
        }
    }

    //Title Field On Change
    function titleOnChange(e){
        setFields({...fields, title: e.target.value})
        contentFieldsRef.current.title = e.target.value
    }

    //Category field On change
    function categoryOnChange(e){
        setFields({...fields, category: e.target.value})
        contentFieldsRef.current.category = e.target.value
    }

    // handleClose for SnackBar Alert
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return
        }

        setOpen(false)
    }

    return(
        <>
        
        <div className="add-content-page">
            <div className="input-area">
                <form action="" onSubmit={submitHandle}>
                    <textarea name="" id="" placeholder="Embed Link" onChange={embedOnChange} value={fields.embedLink}></textarea> <br />
                    <input type="text" placeholder="Title"  onChange={titleOnChange} value={fields.title}/> <br />
                    <input type="text" placeholder="Category" onChange={categoryOnChange} value={fields.category}/> <br />
                    <input type="submit" value={"Add"} className="white-btn"/>
                </form>
            </div>
            <div className="display-area">
                <iframe width="560" height="315"
                src={`https://www.youtube.com/embed/${fields.videoId}?si=${fields.siValue}`}
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen></iframe>
            </div>
        </div>
        <StatusModal open={open} handleClose={handleClose} isError={isError} statusMessage={statusMessage}/>
        </>
        
    )
}

function VideoFileSection({setIsLoading}){
    const [drag, setDrag] = useState()
    const [videoFile, setVideoFile] = useState(null)
    const [title, setTitle] = useState()
    const [category, setCategory] = useState()
    const [open, setOpen] = useState(false)                // set open for Snackbar Alert
    const [statusMessage, setStatusMessage]= useState()    // set Snackbar Alert Message
    const [isError, setIsError] = useState() 
    const api = useAPI()
    const {accessToken, logout, refresh} = useAuth()

    function onDragOverHandle(e){
        e.preventDefault()
        setDrag(true)
    }
    function onDragLeaveHandle(e){
        e.preventDefault()
        setDrag(false)
        
    }
    function onDropHandle(e){
        e.preventDefault()
        setDrag(false)

        const file = e.dataTransfer.files[0]
        if (!file) return

        if (!file.type.startsWith('video/')) {
        setVideoFile(null)
        return
        }

        const previewURL = URL.createObjectURL(file)
        setVideoFile({
        file,
        preview: previewURL,
        })
        
    }

    function fileOnChange(e){
        const file = e.target.files[0]

        if (!file) return

        if (!file.type.startsWith('video/')) {
            setVideoFile(null)
            return
        }
        console.log(file)
        const previewURL = URL.createObjectURL(file)
        setVideoFile({
            file: file,
            preview: previewURL,
        })

    }
    async function formSubmitHandle(e){
        setIsLoading(true)
        setOpen(false)
        e.preventDefault()
        const formData = new FormData()
        formData.append('video', videoFile?.file)
        formData.append('title', title)
        formData.append('category', category)

        let x = 2
        let statusError
        do{
            let token = statusError === 401 ? await refresh() : accessToken
            //Creates content data from API
            await api.post('/content/video-upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }})
            .then(response =>{
                console.log(response)
                setIsError(false)
                setStatusMessage("Content has been added successfully.")
                x--
            })
            .catch(err=>{
                let errMessage = err.response?.data.message
                statusError = err.response.status
                console.error(errMessage)
                setIsError(true)
                
                if (!statusError === 401){
                    x-- // stops the loop if there's no error
                }
                if (statusError === 401 && x === 1){
                    logout()   //Logouts after the request takes two Unauthorized request
                                //This means it is unable to generate new accessToken
                                //Refresh token expired or didn't exist
                }
                else{
                    //sets status message to be displayed in the Snackbar Alert
                    if (errMessage.includes("validation failed")){
                        setStatusMessage("All fields are required.")
                    }
                    else if (errMessage.includes("duplicate key")){
                        setStatusMessage("Content is already been added")
                    }
                    else{
                        setStatusMessage("There is an internal error.")
                    }
                }
            })
            x--
        }while(x > 0)
            
        setIsLoading(false)
        setOpen(true)
        setTitle('')
        setCategory('')
        setVideoFile(null)
        
    }
    function titleOnChange(e){
        setTitle(e.target.value)
    }
    function categoryOnChange(e){
        setCategory(e.target.value)
    }
    useEffect(() => {
        return () => {
            if (videoFile?.preview) {
                URL.revokeObjectURL(videoFile.preview)
            }
        }
    }, [videoFile])

    // handleClose for SnackBar Alert
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return
        }

        setOpen(false)
    }

    return(
        <>
        <div className="add-content-page" >
            <div className="input-area">
                <form action="" onSubmit={formSubmitHandle}>
                    <input type="text" placeholder="Title" name="title" onChange={titleOnChange} value={title}/> <br />
                    <input type="text" placeholder="Category" name="category" onChange={categoryOnChange} value={category}/> <br />
                    <input type="submit" value={"Add"} className="white-btn"/>
                </form>
            </div>
            <div style={{position: 'relative'}}>
                <label htmlFor="input-file">
                    <input type="file" id="input-file" accept="video/*" onChange={fileOnChange} hidden/>
                    <div className="drop-area" onDragOver={onDragOverHandle} onDragLeave={onDragLeaveHandle} onDrop={onDropHandle}>
                    
                        {!videoFile ? (!drag ? 
                        <>
                        <p>Click here to upload video file</p>
                        <p>or Drag file here</p>
                        </>
                        :
                        <p>Drop here</p>)
                        :
                        <video src={ videoFile && videoFile.preview} type={ videoFile && videoFile.file.type} controls>
                        </video>
                        }
                    </div>
                </label>
                {videoFile && <div className="x" onClick={()=>{setVideoFile(null)}}>x</div>}
            </div>
        </div>
        <StatusModal open={open} handleClose={handleClose} isError={isError} statusMessage={statusMessage}/>
        </>
    )
}

export default function AddContentPage({contentFieldsRef, setIsLoading}){
    const [toggle, setToggle] = useState(0)
    return(
        <>
            <div className="add-content-btn">
                <button onClick={()=>{setToggle(0)}} data-highlight={toggle === 0}>Youtube</button>
                <button onClick={()=>{setToggle(1)}} data-highlight={toggle === 1}>Upload Video File</button>
            </div>
            {toggle === 0 ? 
                <YoutubeSection contentFieldsRef={contentFieldsRef} setIsLoading={setIsLoading}/>
                :
                <VideoFileSection setIsLoading={setIsLoading}/>
            }
        </>
    )
}