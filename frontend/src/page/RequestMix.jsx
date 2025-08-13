import { useEffect, useState } from "react"
import Footer from "../Components/Footer"
import Header from "../Components/Header"
import '../styles/requestmix.css'


function Input({index, name, placeholder, type, required, data, setData, errorGroup, setErrorGroup}){
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [focus, setFocus] = useState(false)

    // On change
    function onChange(e){
        setData({...data, [name]:e.target.value })
        setFocus(true);
    }
    
    // Effect
    useEffect(()=>{
        
        if (required){
            if (focus && !data[name]){
                setError(true)
                setErrorMsg("This field is required")
            }
            else if(focus && type === "email" && !data[name].match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")){
                setErrorMsg("Invalid Email")
                setError(true)
               
            }
            else{
                setError(false)
            }
        }
        console.log('first')
    },[focus, data])

    //Effect
    useEffect(()=>{
        let tmpErrGroup = [...(errorGroup || [])]
        tmpErrGroup[index] = error === null ? false : error;
        setErrorGroup(tmpErrGroup)
    },[error, focus, data])

    function handleOnBlur(){
        setFocus(true);
    }
    return(
        <div className="input">
            <input type={type} placeholder={placeholder} 
            value={data[name]} onChange={onChange}
            onBlur={handleOnBlur} data-error={error}/>
            <span>{error && errorMsg}</span> 
        </div>
    )
}

function FirstPage({data, setData, errorGroup, setErrorGroup}){
    const attribute = [
        {
            name: "firstName",
            placeholder: "First Name",
            type: "text",
            required: true
        },
        {
            name: "lastName",
            placeholder: "Last Name",
            type: "text",
            required: true
        },
        {
            name: "email",
            placeholder: "Email",
            type: "email",
            required: true
        },
        {
            name: "company",
            placeholder: "Team Name/Company/Organization",
            type: "text",
            required: false
        },
        {
            name: "instagram",
            placeholder: "Instagram Handle",
            type: "text",
            required: false
        },
        {
            name: "tiktok",
            placeholder: "Tiktok Handle",
            type: "text",
            required: false
        },
        {
            name: "facebook",
            placeholder: "Facebook Handle",
            type: "text",
            required: false
        },
    ]

    useEffect(()=>{
        let errGroup = [];

        attribute.forEach(att=>{
            errGroup.push(att.required)
        })
        setErrorGroup(errGroup)
    },[])

    return(
        <div className="first-page">
            {attribute.map((att, index)=> <Input key={index} index={index} {...att} data={data} setData={setData} setErrorGroup={setErrorGroup} errorGroup={errorGroup}/>)}
            {JSON.stringify(errorGroup)}
        </div>
    )
}
function SecondPage({data, setData, errorGroup, setErrorGroup}){
    const attribute = [
        {
            name: "minutes",
            placeholder: "Minute",
            type: "number",
            required: true
        },
        {
            name: "seconds",
            placeholder: "Seconds",
            type: "number",
            required: true
        },
        {
            name: "numberOfMusic",
            placeholder: "Number of Music",
            type: "number",
            required: true
        },
    ]

    useEffect(()=>{
        let errGroup = [];

        attribute.forEach(att=>{
            errGroup.push(att.required)
        })
        setErrorGroup(errGroup)
    },[])
    return(
        <div className="second-page">
            DURATION
            <div className="duration">
                
                {attribute.map((att, index) => 
                <>
                    <p key={att.placeholder}>{att.placeholder}</p>
                    <Input key={index} index={index} {...att} data={data} setData={setData} setErrorGroup={setErrorGroup} errorGroup={errorGroup}/>
                </>
                )}
                {JSON.stringify(errorGroup)}
            </div>
        </div>
    )
}

export default function RequestMix(){
    const [data, setData] = useState({
        firstName: '',
        lastName: "",
        email: "",
        company: '',
        facebook: '',
        instagram: '',
        tiktok: '',
        minutes: '0',
        seconds: '0',
        numberOfMusic: '1'
    })
    const [page, setPage] = useState(0)
    const [errorGroup, setErrorGroup] = useState()
    const pageToDisplay = [
        <FirstPage data={data} setData={setData} errorGroup={errorGroup} setErrorGroup={setErrorGroup} />,
        <SecondPage data={data} setData={setData} errorGroup={errorGroup} setErrorGroup={setErrorGroup}/>
    ]

    function nextPageClickHandle(){
        for (let x = 0 ; x < errorGroup.length; x++){
            if (errorGroup[x] === true){
                return
            }
        }
        setPage(page + 1)
        console.log(errorGroup)
        
    }
    return(
        <>
        <Header/>
        <div className="section">
            <div className="headings">REQUEST FORM</div>
            <div className="page-holder">
                {pageToDisplay[page]}
            </div>
            <div className="btns">
                <button onClick={()=>{setPage(page-1)}} disabled={page < 1}>Back</button>
                <button onClick={nextPageClickHandle}>Next</button>
            </div>
        </div>
        <Footer/>
        </>
    )
}