import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../styles/request.css'
import { useState, useRef } from "react"
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

function InputBox(props){
    const {label, errorMsg, ...inputProps} = props;
    const [focused, setFocused] = useState(false)
    function onChange(e){
        if (e.target.value){
            setFocused(true);
        }
    }
    function handleFocus(e){
        setFocused(true);

    }
    return(
        <div className="input-box">
            <p className="label">{label}</p>
            <input {...inputProps} onBlur={handleFocus} focused={focused.toString()} onChange={onChange}/>
            <span>{errorMsg}</span>
        </div>
    )
}
function PurposeBox(){
    return(
        <div className="purpose-container">
            <p className="label">Purpose</p>
            <div className="radio-container">
                <label htmlFor="competition">
                    <input type="radio" name="purpose" id="competition" value={"competition"} defaultChecked/>
                    Competition
                </label>

                <label htmlFor="other_purpose">
                    <input type="radio" name="purpose" id="other_purpose" value={"other_purpose"}/>
                     Others
                </label>
            </div>
            <input type="text" name="purpose_detail" placeholder="Please Specify"/>
        </div>
    )
}
export default function Request(){
    const scrollBackRef = useRef();
    const [inputs, setInputs] = useState([ 
        {
            id: 1,
            name: "first_name",
            type: "text",
            label: "First Name",
            placeholder: "Enter First Name",
            required: true,
            errorMsg: "This field is required.",
            focused: "false"
        },
        {
            id: 2,
            name: "last_name",
            type: "text",
            label: "Last Name",
            placeholder: "Enter Last Name",
            required: true,
            errorMsg: "This field is required.",
            focused: "false"
            
            
        },
        {
            id: 3,
            name: "email",
            type: "email",
            label: "Enter Email Adress",
            placeholder: "Enter Email Address",
            required: true,
            errorMsg: "Invalid Email Address",
            focused: "false"
            
        },
        {
            id: 4,
            name: "business",
            type: "text",
            label: "Business/Studio/Team Name",
            placeholder: "Enter Business/Studio/Team Name",
            required: true,
            errorMsg: "This field is required.",
            focused: "false"
            
        },
        {
            id: 5,
            name: "instagram",
            type: "text",
            label: "Instagram handle",
            placeholder: "@",
            required: false,
            errorMsg: "",
            focused: "false"
            
        },
        {
            id: 6,
            name: "facebook",
            type: "text",
            label: "Facebook Handle",
            placeholder: "Enter Facebook Link",
            required: false,
            errorMsg: "",
            focused: "false"
            
        },
        {
            id: 7,
            name: "tiktok",
            type: "text",
            label: "Tiktok Handle",
            placeholder: "@",
            required: false,
            errorMsg: "",
            focused: "false"
            
        },
        {
            id: 8,
            name: "other_social",
            type: "text",
            label: "Other",
            placeholder: "Example, https://example.com/myprofile",
            required: false,
            errorMsg: "",
            focused: "false"
            
        }
        
    ])
    const errorRef = useRef([]) //Getting the DOM of each inputs, PURPOSE: verifying if there's error 
    const form = useRef();
    /* SUBMIT CLICK HANDLE */
    function onClickSubmit(e){
        e.preventDefault();
        
        // checking if validationMessage contains value in each input fields
        let thereIsError = false;
        for (let x = 0; x < errorRef.current.length; x++) {
            const input = errorRef.current[x];
            if (input && input.validationMessage) {
                thereIsError = true;
                setInputs(prevInputs => prevInputs.map((inp, index) => {
                    if(index === x){
                        return { ...inp, focused: 'true'}
                    }
                    else{
                        return inp
                    }
                }));
            }
        }
        if(thereIsError){
            alert('Fill up form correctly')
            scrollBackRef.current?.scrollIntoView({ behavior: 'smooth' });
        }else{
            emailjs
            .sendForm('service_t50laqt', 'template_wi4fan5', form.current,{
                publicKey: 'CiLIpAZrfvaLUjNb3',
            })
            .then(
                () => {
                console.log('SUCCESS!');
                },
                (error) => {
                console.log('FAILED...', error.text);
                },
            );
        }
    }

    //Captcha Value Bool
    const [capVal, setCapVal] = useState(null);

    //Captcha On Change
    function recaptchaOnChange(result){
        setCapVal(result);
    }
    return(
        <>
            <Header/>
            <div className="form-container section">
                <h1 className="headings" ref={scrollBackRef}>REQUEST FORM</h1>
                <form action="" onSubmit={onClickSubmit} noValidate ref={form}>
                    <div className="text-input-container">
                        {inputs.map((input, index)=> (
                            <InputBox key={input.id} {...input} ref={el =>errorRef.current[index]= el}/>
                        ))}
                        
                    </div>
                    <PurposeBox/>
                    <ReCAPTCHA sitekey="6LfjEGgrAAAAALy6KACOqMA6-m0HL4l1g9xVzlFy" onChange={recaptchaOnChange}/>
                    <input type="submit" disabled={!capVal} value={"Submit"}/>
                    
                </form>
            </div>
            <Footer/>
        </>
    )
}