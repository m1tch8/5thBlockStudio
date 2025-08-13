
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../../src/styles/outputs.css'
import { useState, useEffect } from "react"
import axios from "axios"
import VideoModal from "../Components/VideoModal"
import VidCard from "../Components/VidCard"

function OutputsSection(){
    const [content, setContent]= useState([])
    
    let categories = content ? [...new Set(content.map(item => item.category))].sort() : null

    let toDisplay;
    if (categories){
        toDisplay = categories.map((category, index) => {
            return(
                <>
                <h4 className="headings" style={{fontSize: '20px', marginTop: '15px'}}>{category}</h4>
                <div className="highlight-container">
                    {content.filter(cont => cont.category === category)
                    .map((cont, index) => <VidCard key={index} values={cont}/>)}
                </div>
                </>
            )
        })
    }
    console.log(categories)
    useEffect(()=>{
            const fetchData = async ()=>{
                axios.get('http://localhost:8888/api/content')
                .then(response => {
                    setContent(response.data);
                    console.log(response.data)
                })
                .catch(error => console.error(error));
            }
            fetchData()
        },[])

    return(
        <div className="outputs-section section">
            <h1 className="headings">OUTPUTS</h1>
            <div className="outputs-container">
                <h4 className="headings" style={{fontSize: '23px', marginTop: '15px'}}>BEST</h4>
                <div className="highlight-container">
                    {content &&
                    content
                    .filter(values => values.highlight === true)
                    .map((values,index) => <VidCard key={index} values={values} autoplay={true}/>)}
                </div>
                <h4 className="headings" style={{fontSize: '23px', marginTop: '15px'}}>OTHERS</h4>
                
                {/* <div className="highlight-container">
                    {content &&
                    content
                    .filter(values => values.highlight !== true)
                    .map((values,index) => <VidCard key={index} values={values}/>)}
                </div> */}
                {toDisplay}
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop:'50px'}}>

            <a href="/request" className="white-btn big-btn">Request a Mix</a>
            </div>
            
        </div>
    )
}

export default function Outputs(){
    return(
        <>
            <Header/>
            <OutputsSection/>
            
            <Footer/>
        </>
    )
}