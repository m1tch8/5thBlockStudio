import { useState } from "react";
import VideoModal from "./VideoModal";

const videoCardStyle = {

}

export default function VideoCard({title, style, videoId, siValue, type}){
    
    const [toggleModal, setToggleModal] = useState(false)

    function toggleClickModal(){
        console.log(type)
        setToggleModal(!toggleModal)
        
    }
    return(
        <>
        
        <div className="video-card" style={style && style}>
            <div className="youtube-wrapper">
                {type ==="youtube" &&
                    <iframe 
                        width="560" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${videoId}?si=${siValue}&autoplay=1&controls=0&mute=1&loop=1&playlist=${videoId}`} 
                        title="YouTube video" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>}
                {type === "file" &&
                    <video src={videoId} autoPlay loop muted playsinline></video>
                }
                
            </div>
            
            <div className="video-card-shadow">
                <div className="video-card-details">
                    <p>{title}</p>
                    <button className="transparent-btn" onClick={toggleClickModal}>Watch Performance</button>
                </div>
            </div>
        </div>
        {toggleModal && <VideoModal modalClick={toggleClickModal} videoId={videoId} siValue={siValue} type={type}/>}
        </>
    )
}
