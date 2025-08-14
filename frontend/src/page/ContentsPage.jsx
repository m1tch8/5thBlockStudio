import { useActionState, useEffect, useState } from "react"
import useAPI from "../Hooks/useAPI"
import useAuth from "../Hooks/useAuth"
import StatusModal from '../Components/StatusModal'

function Card({values, setHighlight, updateContent, deleteContent}){
    const {_id, videoId, siValue, title, category, highlight, type} = values // content data values
    const [isConfirmDelete, setIsConfirmDelete] = useState(false)    
    const [isUpdating, setIsUpdating] = useState(false)            // triggers confirmation modal
    
    function openDeleteClickHandle(){
        setIsConfirmDelete(!isConfirmDelete) //Opens/Closes Delete Confirmation
    }

    // Confirm Delete Function
    function confirmDeleteHandle(){
        setIsConfirmDelete(false) //Closes Delete Confirmation
        deleteContent(_id)     //function call for content deletion
    }

    // Triggers Delete Function after confirming delete
    function updateOnclick(){
        setIsUpdating(!isUpdating)
    }

    // Triggers Update Content Function after confirming update
    function confirmUpdateHandle(values){
        setIsUpdating(false)
        updateContent(_id, values)
    }
    function highlightClickHandle(){
        setHighlight(_id)
    }
    return(
        <>
        <div className="card">
            <div className="vid-container">
                {type ==="youtube" && 
                    <iframe width="560" height="315" 
                    src={`https://www.youtube.com/embed/${videoId}?si=${siValue}` }
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen></iframe>
                }
                {type === "file" &&
                    <video src={videoId} controls></video>
                }
                
            </div>
            <div className="card-detail"> 
                <p>{title}</p>
                <p>{category}</p>
            </div>
            <div className="controls-container">
                <div className="control-btn" data-highlight={`${highlight}`} onClick={highlightClickHandle}>Highlight</div>
                <div className="control-btn" onClick={updateOnclick}>Update</div>
                <div className="control-btn" onClick={openDeleteClickHandle}>Delete</div>
            </div>
            
        </div>
        {isConfirmDelete && 
            <Confirmation openDeleteClickHandle={openDeleteClickHandle} 
                        confirmDeleteHandle={confirmDeleteHandle}/>}
        {isUpdating && 
            <Update title={title} category={category} 
                    updateOnclick={updateOnclick}
                    confirmUpdateHandle={confirmUpdateHandle}/>}
        </>
    )
}
function Confirmation({openDeleteClickHandle, confirmDeleteHandle}){

    return(
        <div className="confirmation">
            <div className="confirmation-container">
                <p>Are you sure you want to delete it?</p>
                <button onClick={confirmDeleteHandle}>Yes</button>
                <button onClick={openDeleteClickHandle}>Cancel</button>
            </div>
            <div className="confirmation-shadow"></div>
        </div>
    )
}
function Update({title, category, updateOnclick, confirmUpdateHandle}){
    const [tmpTitle, setTmpTitle] = useState(title)
    const [tmpCategory, setTmpCategory] = useState(category)
    
    return(
        <div className="update">
            <div className="update-container">
                <p style={{textAlign: 'left'}}>Title</p>
                <input type="text" placeholder="Title" autoFocus value={tmpTitle} onChange={(e)=>{setTmpTitle(e.target.value)}}/>
                <br />
                <p style={{textAlign: 'left'}}>Category</p>
                <input type="text" placeholder="Category" value={tmpCategory} onChange={(e)=>{setTmpCategory(e.target.value)}}/>
                <br />
                <button onClick={()=> confirmUpdateHandle({title: tmpTitle, category: tmpCategory})}>Update</button>
                <button onClick={updateOnclick}>Cancel</button>
            </div>
            <div className="update-shadow"></div>
            
        </div>
    )
}

export default function ContentsPage({setIsLoading}){
    const [isError, setIsError] = useState()               // checks if there is error in submission
    const [open, setOpen] = useState()                     // triggers Snackbar Alert to appear
    const [statusMessage, setStatuMessage] = useState()    // sets status message to Snackbar Alert every http request
    const [content, setContent] = useState()               // content data initialization
    const [category, setCategory] = useState('All')
    let categories = ['All']
    let otherCategory = content ? [...new Set(content.map(item => item.category))].sort() : null
    const api = useAPI()
    const {accessToken, refresh} = useAuth()

    // sets highlight
    async function setHighlight(id){
        setIsLoading(true) // triggers loading screen

        let statusError
        let x = 2

        // Runs http request twice if token expired to generate new token
        do {
            console.log(statusError)
            let token = statusError === 401 ? await refresh() : accessToken

            // updating data from the API (highlight attribute to be specific)
            await api.put(`/content/${id}?highlight=true`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(result => {
                setContent(prev => prev.map(content => content._id === id ? result.data : content)) //updates data state that also trigger re-render and updates the UI
                setIsError(false)
                setOpen(true)
                setStatuMessage(result.data.highlight ? "Added to Highlights" : "Removed to Highlights")
                x-- // stops the loop if request status is 200
            })
            .catch(err => {
                let errMessage = err.response?.data.message
                statusError = err.response.status
                console.error(errMessage)
                
                if (!statusError === 401){
                    x-- // stops the loop if not Unauthorized
                }
                if (statusError === 401 && x === 1){
                    logout()   //Logouts after the request takes two Unauthorized request
                                //This means it is unable to generate new accessToken
                                //Refresh token expired
                }
                else{
                    setStatuMessage("There is an Internal Error. Try to refresh")
                    setIsError(true)
                }
            })
            
            x--
        }while (x > 0)

        setIsLoading(false) // stops loading screen
        setOpen(true)
    }
    
    // updates content data 
    async function updateContent(id, values){
        setIsLoading(true) // triggers loading screen

        let x = 2
        let statusError

        // Runs http request twice if token expired to generate new token
        do{
            let token = statusError === 401 ? await refresh() : accessToken
            
            // updating data content from the api
            await api.put(`/content/${id}`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(result => {
                setContent(prev => prev.map(content => content._id === id ? result.data : content)) //updates data state that also trigger re-render and updates the UI
                setStatuMessage("Updated Successfully")
                setIsError(false)
                x-- // stops the loop if request status is 200
            })
            .catch(err => {
                let errMessage = err.response?.data.message
                    statusError = err.response.status
                    console.error(errMessage)
                    
                    if (!statusError === 401){
                        x-- // stops the loop if not Unauthorized
                    }
                    if (statusError === 401 && x === 1){
                        logout()   //Logouts after the request takes two Unauthorized request
                                    //This means it is unable to generate new accessToken
                                    //Refresh token expired or didn't exist
                    }
                    else{
                        setStatuMessage("There is an Internal Error. Try to refresh")
                    }
                setIsError(true)
            })

            x--
        }while (x > 0)
        

        setOpen(true) //triggers snackbar alert
        setIsLoading(false) // stops loading screen
    }

    // deletes content data
    async function deleteContent(id){
        
        setIsLoading(true) // triggers loading screen
        
        let x = 2
        let statusError

        // Runs http request twice if token expires to generate new token
        do{
            let token = statusError === 401 ? await refresh() : accessToken

            // deleting content data from the API
            await api.delete(`content/${id}`,{
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                }
            })
            .then(result =>{
                setContent(prev => prev.filter(content => content._id !== id))
                setStatuMessage("Deleted Successfully")
                setIsError(false)
                x-- //stops the loop if status 200
            })
            .catch(err=>{
                let errMessage = err.response?.data.message
                statusError = err.response.status
                console.error(errMessage)
                if (!statusError === 401){
                    x-- // stops the loop if not Unauthorized
                }
                if (statusError === 401 && x === 1){
                    logout()   //Logouts after the request takes two Unauthorized request
                                //This means it is unable to generate new accessToken
                                //Refresh token expired or didn't exist
                }
                else{
                    setStatuMessage("There is an Internal Error. Try to refresh")
                }
            setIsError(true)
            })
            x--
        } while(x > 0)
        

        setOpen(true) //triggers snackbar alert
        setIsLoading(false) // stops loading screen
    }

    // loads content data
    useEffect(()=>{
        async function fetchData(){
            setIsLoading(true)  // Triggers loading screen
            
            //fetching content data
            await api.get("/content")
            .then(result => {
                setContent(result.data)
            })
            .catch(err => {
                console.error(err)
            })
            setIsLoading(false)
        }

        fetchData()

    },[])

    //closes the snackbar alert
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return
        }

        setOpen(false)
    }
    
    function categoryOnChange(e){
        setCategory(e.target.value)
    }
    
    // All Cards Display filtered with Category
    let toDisplayAllContent
    if(content){
        toDisplayAllContent = category === 'All' ? 
            content
                .map(value => 
                    <Card 
                        key={value._id} 
                        values={value} 
                        setHighlight={setHighlight}
                        updateContent={updateContent}
                        deleteContent={deleteContent}
                    />)
            :
            content
                .map(value => value.category === category &&
                    <Card 
                        key={value._id} 
                        values={value} 
                        setHighlight={setHighlight}
                        updateContent={updateContent}
                        deleteContent={deleteContent}
                    />)
    }

    // Highlighted Cards Display
    let toDisplayHighlightedContent
    if(content){
        toDisplayHighlightedContent = content.filter(value => value.highlight)
                    .sort((a,b) => a.order - b.order)
                    .map(value => 
                        <Card 
                            key={value._id} 
                            values={value} 
                            setHighlight={setHighlight}
                            updateContent={updateContent}
                            deleteContent={deleteContent}
                        />) 
    }
    
    if (otherCategory){
        otherCategory.forEach(element => {
            categories.push(element)
        })
    }

    return(
        <>
        <h4 style={{
            fontSize: '25px',
            fontWeight: '800',
            marginTop: '10px'
        }} className="headings">HIGHLIGHTED</h4>

        <div className="highlighted" style={{marginBottom: '30px'}}>
            {toDisplayHighlightedContent}
        </div>

        <h4 style={{
            fontSize: '25px',
            fontWeight: '800',
            marginTop: '10px'
        }} className="headings">ALL CONTENTS</h4>

        <select name="category" id="category" onChange={categoryOnChange}
            style={{
            width: '200px',
            padding: '10px',
            border: '2px solid #444',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#414141',
            color: 'white',
            marginBottom: '20px'
        }}>
            {categories && 
                categories.map((value, index) => 
                    <option key={index} value={value} style={{color: 'white'}}>
                        {value}
                    </option>)}
        </select>
        <div className="contents-page">
            {toDisplayAllContent}
        </div>
        <StatusModal open={open} handleClose={handleClose} isError={isError} statusMessage={statusMessage}/>
        
        </>
    )
}