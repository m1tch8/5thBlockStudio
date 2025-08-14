import { useEffect, useRef, useState } from "react"
import useAPI from "../Hooks/useAPI"
import useAuth from "../Hooks/useAuth"
import StatusModal from "../Components/StatusModal"

function ChangePassword({setToggleChangePass, setIsError, setOpen, setStatusMessage}){
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const {accessToken} = useAuth()
    const api = useAPI()

    function oldPassOnChange(e){
        setOldPass(e.target.value)
    }
    function newPassOnChange(e){
        setNewPass(e.target.value)
    }

    //Password Change Submit
    async function changePass(){
        setIsLoading(true)
        setOpen(false)
        await api.put("/user/change-password",{
            oldPassword: oldPass,
            newPassword: newPass
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        }).then(response=>{
            setStatusMessage("Password has been changed successfully")
            setIsError(false)
            setToggleChangePass(false)
        })
        .catch(err=>{
            console.error(err)
            setIsError(true)
            setStatusMessage(err.response.data.message)
        })
        setOpen(true)
        setIsLoading(false)
    }

    return(
        <>
        <div className="change-password">
            <div className="change-password-container">
                <p style={{textAlign: 'left'}}  value={oldPass}>Old Password</p>
                <input type="password" placeholder="Enter Old Password" onChange={oldPassOnChange}/> <br />
                <p style={{textAlign: 'left'}}  value={newPass}>New Password</p>
                <input type="password" placeholder="Enter New Password" onChange={newPassOnChange}/> <br />
                <button onClick={changePass}>Confirm</button>
                <button onClick={()=>{setToggleChangePass(false)}}>Cancel</button>
            </div>
            <div className="change-password-shadow"></div>
        </div>
        </>
    )
}

export default function AccountPage({setIsLoading}){
    const [userDetails, setUserDetails] = useState(null)
    const {accessToken, refresh, logout} = useAuth()
    const [toggleChangePass, setToggleChangePass] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isError, setIsError] = useState()               // checks if there is error in submission
    const [open, setOpen] = useState()                     // triggers Snackbar Alert to appear
    const [statusMessage, setStatusMessage] = useState()    // sets status message to Snackbar Alert every http request
    const editRef = useRef()
    const userDetailsRef = useRef({})
    const api = useAPI()
    
    
    //Loads logged current user
    useEffect(()=>{
        async function getUser(){
            setIsLoading(true)

            let x = 2
            let statusError
            //If token is expired, it will run 2 times to get new token
            do{
                let token = statusError ? await refresh() : accessToken
                await api.get("/user/current",{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(result =>{
                    setUserDetails(result.data)
                })
                .catch(err =>{
                    if(!statusError === 401){
                        x--
                    }
                    if(statusError === 401 && x === 1){
                        logout()
                    }
                    statusError = err.response.status
                    console.error(err.message)
                })
                x--
            } while(x > 0)

            setIsLoading(false)
        }
        getUser()
        
    },[])

    const textStyle = {
        padding: '10px',
        width: '300px',
        marginBottom: '10px',
        color: 'black'
    }

    //Update user data
    async function update(){
        
        setIsLoading(true)
        setOpen(false)
        await api.put("/user/update",{
            username: userDetails.username,
            email: userDetails.email
        },{
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type' : 'application/json'
            }
        })
        .then(response => {
            refresh()
            setIsError(false)
            setStatusMessage("Updated Successfully")
        })
        .catch(err =>{
            console.error(err)
            setIsError(true)
            setStatusMessage("Cannot Update. Internal Error")
        })
        setIsLoading(false)
        setIsEdit(false)
        setOpen(true)
    }

    function editOnClick(){
        setIsEdit(true)
        editRef.current.focus()
        //saves the previous email and username
        userDetailsRef.current = {
            username: userDetails.username,
            email: userDetails.email
        }
    }

    function editCancelOnClick(){
        setIsEdit(false)

        // sets back the previous username and email
        setUserDetails({...userDetails, username: userDetailsRef.current.username, email: userDetailsRef.current.email})
    }

    //Auto close Snackbar Alert
    const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return
        }

        setOpen(false)
    }

    return(
        <>
        <div className="user-form-container" >
            <form action="" style={{paddingTop: '30px'}} onSubmit={(e)=>{e.preventDefault}}>
                <p>Username</p>
                <input type="text" ref={editRef} style={textStyle} value={userDetails && userDetails.username} readOnly={!isEdit} onChange={(e)=>{setUserDetails({...userDetails, username: e.target.value})}}/>
                <br />
                <p>Email</p>
                <input type="text" style={textStyle} value={userDetails && userDetails.email} readOnly={!isEdit} onChange={(e)=>{setUserDetails({...userDetails, email: e.target.value})}}/>
                <br />
            </form>
            {!isEdit ? 
            <>
                <button onClick={editOnClick}>Edit</button>
                <button onClick={()=>{setToggleChangePass(true)}}>Change Password</button>
            </>
            :   
            <>
                <button onClick={update}>Save</button>
                <button onClick={editCancelOnClick}>Cancel</button>
            </>
            
            }
        </div>
        {toggleChangePass && 
            <ChangePassword setToggleChangePass={setToggleChangePass} 
            setStatusMessage={setStatusMessage} 
            setIsError={setIsError} 
            setOpen={setOpen}
            setIsLoading={setIsLoading}/>
        }
        
        <StatusModal open={open} handleClose={handleClose} isError={isError} statusMessage={statusMessage}/>
        </>
    )
}