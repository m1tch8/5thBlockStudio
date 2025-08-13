import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth"
import useAPI from "../Hooks/useAPI";
import { useEffect, useRef, useState } from "react";
import '../styles/admin.css'
import Logo from "../Components/Logo";
import LoadingScreen from "../Components/LoadingScreen";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddContentPage from "./AddContentPage";
import AccountPage from "./AccountPage";
import ContentsPage from "./ContentsPage";

function SideBar(prop){
    const { onDisplayHandle, onDisplay } = prop
    const {logout} = useAuth()
    return(
        <div className="sidebar">
            <Logo style={{fontSize: '14px', marginLeft: '20px'}}/>
            <div className="sidebar-menu">
                <div className="sidebar-btn" data-highlight={onDisplay==='Contents'}onClick={onDisplayHandle}>Contents</div>
                <div className="sidebar-btn" data-highlight={onDisplay==='Add Content'} onClick={onDisplayHandle}>Add Content</div>
                <div className="sidebar-btn" data-highlight={onDisplay==='Account'} onClick={onDisplayHandle}>Account</div>
                <div className="sidebar-btn" onClick={logout}>Logout</div>
            </div>
        </div>
    )
}

export default function Admin(){
    const [onDisplay, setOnDisplay] = useState("Contents")
    const [isLoading, setIsLoading] = useState(false)
    const contentFieldsRef = useRef({
        embedLink: '',
        title: '',
        category: '',
        videoId: '',
        siValue: ''
    });
    
    
    function onDisplayHandle(e){
        const toDisplay = e.target.innerHTML;
        setOnDisplay(toDisplay);
    }
    let pageOnDisplay;
    
    switch (onDisplay){
        case "Contents":
            pageOnDisplay = <ContentsPage setIsLoading={setIsLoading}/>
            break;
        case "Add Content":
            pageOnDisplay = <AddContentPage contentFieldsRef={contentFieldsRef} 
                                            setIsLoading={setIsLoading}
                                            />
            break;
        case "Account":
            pageOnDisplay = <AccountPage setIsLoading={setIsLoading}/>
            break;
        default:
            pageOnDisplay = <ContentsPage/>
            break;
    }
    return(
        <>
        <div className="admin-section">
            <SideBar onDisplayHandle={onDisplayHandle} onDisplay={onDisplay}/>
            <h3 className="headings">{onDisplay.toUpperCase()}</h3>
            <div className="display-section">
                {pageOnDisplay}
            </div>
        </div>
        {isLoading && <LoadingScreen/>}
        
        </>
        
    )
}

