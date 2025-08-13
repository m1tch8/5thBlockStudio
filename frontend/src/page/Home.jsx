import Header from "../Components/Header.jsx"
import Footer from "../Components/Footer"
import MusicCard from "../Components/MusicCard.jsx"
import FloatingIcons from "../Components/FloatingIcons.jsx"
import '../styles/home.css'
import axios from "axios"
import { useState, useEffect } from "react"
import VidCard from "../Components/VidCard.jsx"
import { useNavigate } from "react-router-dom"
import VideoModal from "../Components/VideoModal.jsx"
import LoadingScreen from "../Components/LoadingScreen.jsx"

function HeroSection(){

    return(
        <>
            <div className="hero-container">
                <img src="../src/assets/generals-hero-image.png" alt="" className="hero-banner-image"/>
                <div className="gradient">
                    <div className="hero-items-container">
                        <div className="logo-container">
                            <img src="../../src/assets/5th_Block_Logo.png" alt="5thblock" className="hero-logo"/>
                        </div>
                        <div className="hero-item-details">
                            <div className="hero-text-container">
                                <h1 className="hero-title">MUSIC PRODUCTION & MIXING SERVICES</h1>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia vitae quidem pariatur nihil minima tempora culpa harum delectus eaque eius!</p>
                            </div>
                            <div className="hero-btn-container">
                                <a href="/request" className="white-btn big-btn">Request a Mix</a>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                
            </div>
        </>
    )
}

function FeaturedCard({values}){
    const {title, siValue, videoId, type} = values
    const [toggleModal, setToggleModal] = useState()
    function modalClick(){
        setToggleModal(!toggleModal)
    }
    return(
        <>
        <div className="featured-card">
            <div className="featured-vid-container">
                {type === "youtube" && 
                    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoId}?si=${siValue}&autoplay=1&controls=0&mute=1&loop=1&playlist=${videoId}`}
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen></iframe> 
                }
                {type === "file" &&
                    <video src={videoId} autoPlay loop muted></video> 
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

function FeaturedSection(){

    const [videoValues, setVideoValues] = useState();
    const [isLoading, setIsLoading] = useState()

    // fetching content data from api
    useEffect(()=>{
        setIsLoading(true)
        const fetchData = async ()=>{
            await axios.get('http://localhost:8888/api/content?highlight=true')
            .then(response => {
                setVideoValues(response.data);
                console.log(response.data)
            })
            .catch(error => console.error(error));
        }
        fetchData()
        setIsLoading(false)
    },[])
    
    return(
        <>
            <div className="featured-section section">
                <h1 className="headings">FEATURED MIX</h1>
                <div className="featured-container">
                    <div className="main">
                        {videoValues && <FeaturedCard values={videoValues[0]}/>}
                    </div>
                    <div className="secondary">
                        {videoValues && <VidCard values={videoValues[1]} autoplay={true}/>}
                        {videoValues && <VidCard values={videoValues[2]} autoplay={true}/>}
                    </div>
                </div>
            </div>
            {isLoading && <LoadingScreen/>}
        </>
    )
}
function ShopSection(){

    return(
        <>
            <div className="shop-section section">
                <h1 className="headings">SHOP</h1>
                <div className="music-items-container">
                    {
                        
                    }
                    <MusicCard/>
                    <MusicCard/>
                    <MusicCard/>
                    <MusicCard/>
                    <MusicCard/>
                    <MusicCard/>
                    <MusicCard/>
                    <a href="/shop">
                        <div className="see-more">
                            <p>See More...</p>
                        </div>
                    </a>
                    
                </div>
            </div>
        </>
    )
}
function BannerSection(){
    const navigate = useNavigate()
    return(
        <div className="banner-section section" style={{marginTop:'20px'}}>
            <div className="banner-container">
                <img src="../../src/assets/vibe.png" alt="" />
                <div className="banner-details">
                    <div className="details-wrapper">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, molestias.</p>
                        <button className="white-btn" onClick={()=>{navigate("/request")}}>Request a Mix</button>
                    </div>
                    
                </div>
                <div className="banner-shadow"></div>
            </div>
            <div className="banner-container">
                <img src="../../src/assets/cheer.jpg" alt="" />
                <div className="banner-details">
                    <div className="details-wrapper">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, molestias.</p>
                        <div style={{display: 'flex', justifyContent:'flex-end'}}>
                            <button className="white-btn" onClick={()=>{navigate("/request")}}>Request a Mix</button>
                        </div>
                    </div>
                    
                </div>
                <div className="banner-shadow"></div>
            </div>
            <div className="banner-container">
                <img src="../../src/assets/concert.jpg" alt="" style={{objectPosition: '50% 70%'}}/>
                <div className="banner-details">
                    <div className="details-wrapper">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, molestias.</p>
                        <button className="white-btn" onClick={()=>{navigate("/request")}}>Request a Mix</button>
                    </div>
                    
                </div>
                <div className="banner-shadow" ></div>
            </div>
        </div>
    )
}
export default function Home(){
    return(
        <>
            <Header/>
            <HeroSection/>
            <FloatingIcons/>
            <FeaturedSection/>
            <a href="/outputs" className="show-more-link"> 
                <div className="show-more">
                    <video loop muted autoPlay >
                        <source src="../../src/assets/[Front Row] NDDU Generals  Philippines  Body Rock Asia 2025.mp4"/>
                    </video>
                    <div className="dark-background"></div>
                    <div>
                        <p >Click here to see more Mixes</p>
                    </div>
                    
                </div>
            </a>
            <BannerSection/>
            <Footer/>
        </>
    )
}