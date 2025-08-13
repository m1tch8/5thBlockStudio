
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../../src/styles/outputs.css'
import { useState, useEffect } from "react"
import axios from "axios"
import VidCard from "../Components/VidCard"
import LoadingScreen from "../Components/LoadingScreen"

function OutputsSection(){
    
    const [isLoading, setIsLoading] = useState()
    const [content, setContent]= useState([])
    
    let categories = content ? [...new Set(content.map(item => item.category))].sort() : null

    // Displays content data separated by category
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

    //Fetching content data from the API
    useEffect(()=>{
        setIsLoading(true)
        const fetchData = async ()=>{
            await axios.get('http://localhost:8888/api/content')
            .then(response => {
                setContent(response.data);
                console.log(response.data)
            })
            .catch(error => console.error(error));
        }
        fetchData()
        setIsLoading(false)
    },[])

    return(
        <>
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
                {toDisplay}
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop:'50px'}}>

            <a href="/request" className="white-btn big-btn">Request a Mix</a>
            </div>
        </div>
        {isLoading && <LoadingScreen/>}
        </>
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