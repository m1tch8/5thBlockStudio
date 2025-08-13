import { useState } from "react";
import LoadingScreen from '../Components/LoadingScreen';

function StatusModal({onClick}){
    
    return(
        <div className="status-modal">
            <div className="status-details-wrapper">
                <i class="bi bi-check-circle" style={{ fontSize: '50px'}}></i>
                <p style={{fontSize: '18px',marginBottom: '10px'}}>Your request has been submitted.</p>
                <p style={{fontSize: '14px', marginBottom: '30px'}}>We will reach out to you as soon as we can. <span style={{fontWeight: '700'}}>Thank you!</span></p>
                <button className="close" onClick={onClick}>Close</button>
            </div>
        </div>
    )
}

export default function SubmitModal({setIsLoading, submitStatus, setSubmitStatus}){

    function onClickClose(){
        setIsLoading(false);
        setSubmitStatus(false);
    }

    return(
        <div className="submit-modal">
            {submitStatus ? 
            <>
            <StatusModal onClick={onClickClose}/>
            <div className="shadow-submit-modal"></div>
            </>
            : <LoadingScreen/> }
            
        </div>
    )
}

/* */