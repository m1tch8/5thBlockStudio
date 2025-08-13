import '../styles/videomodal.css'
import { useEffect, useState } from "react"

const videoModalStyle ={
    display: 'flex',
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '20',
}

const shadowModalStyle = {
    position:'absolute',
    backgroundColor: 'black',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
    zIndex: '-1',
    opacity: '0.9',
}
const youtubeModalStyle ={
    aspectRatio: '16/9',
    width: '1000px',
    marginLeft: '30px',
    marginRight: '30px',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
}

const iframeStyle ={
    width: '100%', 
    height: '100%', 
    top: '0', 
    right: '0', 
    left: '0', 
    bottom: '0', 
}
const videoModalCloseStyle = {
    position: 'absolute',
    width: '40px',
    height: '30px',
    background: 'transparent',
    cursor: 'pointer',
    display: 'block',
    top: '100px',
    right: '30px',
}
export default function VideoModal({modalClick, videoId, siValue, type}){

    useEffect(()=>{
        const handleEscape = (event)=>{
            if(event.key === "Escape"){
                modalClick();
            }
        }
        document.addEventListener('keyup', handleEscape);
        return ()=>{
            document.removeEventListener('keyup', handleEscape);
        }
        
    },[])
    
    return(
        <div className="video-modal" style={videoModalStyle}>
            <div className="shadow-video-modal" onClick={modalClick} style={shadowModalStyle}></div>
            <div className="youtube-modal" style={youtubeModalStyle}>
                {type === "youtube" &&
                <iframe style={iframeStyle}
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${videoId}?si=${siValue}`}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
                </iframe>}
                {type ==="file" &&
                    <video style={iframeStyle} src={videoId} controls></video>
                }
            </div>
            <label className="video-modal-close" htmlFor="close" onClick={modalClick} style={videoModalCloseStyle}>
                <input type="checkbox" id="close" checked style={{display: 'none'}}/>
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div> 
        
    )
}