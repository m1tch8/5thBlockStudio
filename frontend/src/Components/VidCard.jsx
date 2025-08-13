import { useState } from "react"
import '../styles/VidCard.css'
import VideoModal from "./VideoModal"

export default function VidCard({values, autoplay, style}){
    const {title, siValue, videoId, type} = values
    const [toggleModal, setToggleModal] = useState()
    function modalClick(){
        setToggleModal(!toggleModal)
    }
    return(
        <>
        <div className="vid-card" style={style && style}>
            <div className="ytvid-container">
                {type === "youtube" && 
                (autoplay ? 
                    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoId}?si=${siValue}&autoplay=1&controls=0&mute=1&loop=1&playlist=${videoId}`}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen></iframe> 
                :
                <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="YouTube video thumbnail"
                    style={{ width: '100%', maxWidth: '480px' }}
                />)
                }
                {type === "file" &&
                (autoplay ? 
                    <video src={videoId} autoPlay loop muted></video>
                    :
                    <video src={videoId}></video>
                )
                    
                }
                <p>{title}</p>
                <button className="transparent-btn" onClick={modalClick}>Watch Performance</button>
                <div></div>
            </div>
        </div>
        {toggleModal && <VideoModal modalClick={modalClick} videoId={videoId} siValue={siValue} type={type}/>}
        </>
        
    )
}