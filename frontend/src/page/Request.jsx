import Header from '../Components/Header'
import Footer from '../Components/Footer'
import '../styles/request.css'
import { useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import ReCAPTCHA from 'react-google-recaptcha'
import LoadingScreen from '../Components/LoadingScreen'

function InputField(props){
    const {label, errorMsg, placeholder, focused, ...inputProps} = props
    const [stateFocused, setStateFocused] = useState(focused)    
    const isDateInput = inputProps.type === 'date'
    const [currentType, setCurrentType] = useState(inputProps.type)

    useEffect(() => {
        setStateFocused(focused)
    }, [focused])

    useEffect(() => {
        if (isDateInput && !inputProps.value && !inputProps.defaultValue) {
            setCurrentType('text')
        }
    }, [isDateInput, inputProps.value, inputProps.defaultValue])

    function onChange(e){
        if (e.target.value){
            setStateFocused(true)
        }
    }
    function handleBlur(e){
        setStateFocused(true)
        if (isDateInput && !e.target.value) {
            setCurrentType('text')
        }
    }
    
    function handleFocus() {
        if (isDateInput) {
            setCurrentType('date')
        }
    }

    return(
        <div className={props.customclassname ? "input-field" + props.customclassname : "input-field"}>
            <input 
                placeholder='...' 
                {...inputProps} 
                onFocus={handleFocus}
                onBlur={handleBlur} 
                focused={stateFocused.toString()} 
                onChange={onChange}
                type={currentType}
            />
            <div className="label-placeholder" >{placeholder}</div>
            <span>{errorMsg}</span>
        </div>
    )
}
function Checkbox(props){
    const {value, id, ...prop} = props

    return(
        <>
        <input id={id} {...prop} value={value}/>
        <label htmlFor={id}>{value}</label>
        </>
    )
}
export default function Request(){
    const [isLoading, setIsLoading] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(false)
    const [capchtaValue, setCapchtaValue] = useState(null)
    const [submitError, setSubmitError] = useState(
        {
            error: false,
            errorMsg: ''
        }
    )
    const scrollBackRef = useRef()
    const [inputs, setInputs] = useState([ 
        {
            id: 1,
            name: "first_name",
            type: "text",
            label: "First Name",
            placeholder: "Enter First Name",
            required: true,
            errorMsg: "This field is required.",
            focused: false
        },
        {
            id: 2,
            name: "last_name",
            type: "text",
            label: "Last Name",
            placeholder: "Enter Last Name",
            required: true,
            errorMsg: "This field is required.",
            focused: false
            
            
        },
        {
            id: 3,
            name: "email",
            type: "email",
            label: "Enter Email Adress",
            placeholder: "Enter Email Address",
            required: true,
            errorMsg: "Invalid Email Address",
            focused: false
            
        },
        {
            id: 4,
            name: "business",
            type: "text",
            label: "Business/Studio/Team Name",
            placeholder: "Enter Business/Studio/Team Name",
            required: true,
            errorMsg: "This field is required.",
            focused: false
            
        },
        {
            id: 5,
            name: "instagram",
            type: "text",
            label: "Instagram handle",
            placeholder: "Instagram Handle",
            required: false,
            errorMsg: "",
            focused: false,
            
        },
        {
            id: 6,
            name: "facebook",
            type: "text",
            label: "Facebook Handle",
            placeholder: "Facebook Handle",
            required: false,
            errorMsg: "",
            focused: false
            
        },
        {
            id: 7,
            name: "tiktok",
            type: "text",
            label: "Tiktok Handle",
            placeholder: "Tiktok Handle",
            required: false,
            errorMsg: "",
            focused: false
            
        },
        {
            id: 8,
            name: "other_social",
            type: "text",
            label: "Other",
            placeholder: "Other Social Handle",
            required: false,
            errorMsg: "",
            focused: false
            
        },
        {
            id: 9,
            name: "duration_min",
            type: "number",
            label: "duration_min",
            placeholder: "Minute/s",
            required: true,
            errorMsg: "Invalid input",
            focused: false,
            min: 0,
            
        },
        {
            id: 10,
            name: "duration_sec",
            type: "number",
            label: "duration_sec",
            placeholder: "Second/s",
            required: true,
            errorMsg: "Invalid input",
            focused: false,
            min: 0,
            max: 59
            
        },
        {
            id: 11,
            name: "number_of_songs",
            type: "number",
            label: "number_of_song",
            placeholder: "Number of Songs",
            required: true,
            errorMsg: "Invalid input",
            focused: false,
            min: 1,
            
        },
        {
            id: 12,
            name: "date_needed",
            type: "date",
            label: "date_needed",
            placeholder: "Date Needed",
            required: true,
            errorMsg: "Choose a date",
            focused: false,
        },

    ])
    const errorRef = useRef([]) 
    const form = useRef()
    const found = [
        {
            id: 'instagram',
            type: "checkbox",
            name: 'found',
            value: "Instagram"
        },
        {
            id: 'tiktok',
            type: "checkbox",
            name: 'found',
            value: "Tiktok"
        },
        {
            id: 'facebook',
            type: "checkbox",
            name: 'found',
            value: "Facebook"
        },
        {
            id: 'referral',
            type: "checkbox",
            name: 'found',
            value: "Referral"
        }
    ]
    const mixStyle = [
        {
            id: 'hiphop',
            type: "checkbox",
            name: 'mix_style',
            value: "Hiphop"
        },
        {
            id: 'cheerpom',
            type: "checkbox",
            name: 'mix_style',
            value: "Cheer/Pom"
        },
        {
            id: 'lyrical',
            type: "checkbox",
            name: 'mix_style',
            value: "Lyrical/Jazz/Contemporary"
        },
        {
            id: 'others',
            type: "checkbox",
            name: 'mix_style',
            value: "Others"
        },
    ]

    async function submitRequest(){
        
        await emailjs.sendForm("service_t50laqt", 'template_wi4fan5', form.current,{
            publicKey: 'CiLIpAZrfvaLUjNb3',
        })
        .then(() => {
            console.log('emailJS: Email Sent')
            setSubmitStatus(true)
            setIsLoading(false)
        },
        (error) => {
            console.error('emailJS: Unable to send email...', error.text)
            setSubmitError({error: true, errorMsg: 'There is something wrong. Unable to send request.'})
            setIsLoading(false)
        },
        )
    }

    useEffect(()=>{ //Sending Form to Email
        if(isLoading){
            submitRequest()
        }
    },[isLoading])

    //Form Submission
    function onClickSubmit(e){ 
        
        e.preventDefault()
        // checking if validationMessage contains value in each input fields
        let thereIsError = false
        for (let x = 0; x < errorRef.current.length; x++) {
            const input = errorRef.current[x]
            if (input && input.validationMessage) {
                thereIsError = true
                setInputs(prevInputs => prevInputs.map((inp, index) => {
                    if(index === x){
                        return { ...inp, focused: true}
                    }
                    else{
                        return inp
                    }
                }))
            }
        }

        if(thereIsError){
            setSubmitError({error: true, errorMsg: 'please Fill up form correctly.'})
            scrollBackRef.current?.scrollIntoView({ behavior: 'smooth' })
        }else{
            setSubmitError({error: false, errorMsg: ''})
            setIsLoading(true)
        }
        
    }
    //Captcha On Change
    function recaptchaOnChange(result){
        setCapchtaValue(result)
    }

    const getTomorrowDate = () => {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1) // Add one day to today's date
        const dd = String(tomorrow.getDate()).padStart(2, '0')
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0') // Month is 0-indexed, so add 1
        const yyyy = tomorrow.getFullYear()
        return `${yyyy}-${mm}-${dd}`
    }
    const minDate = getTomorrowDate()

    return(
        <>
        <Header/>
        {!submitStatus &&
            <div className="section">
                <h3 className="headings" ref={scrollBackRef}>REQUEST FORM</h3>
                <div className="container">
                    <form action="" onSubmit={onClickSubmit} noValidate ref={form}>
                        <div className="input-container">
                            {
                                inputs.map(
                                    (input, index)=> (index < 8 &&
                                        <InputField key={input.id} {...input} 
                                        ref={el =>errorRef.current[index]= el}/>
                                    )
                                )
                            }
                        </div>
                        <div className='duration-text'>DURATION</div>
                        <div className="input-container">
                            {
                                inputs.map(
                                    (input, index)=> (index > 7 && index < 11 &&
                                        <InputField key={input.id} {...input} 
                                        ref={el =>errorRef.current[index]= el}/>
                                    )
                                )
                            }
                        </div>
                        <div className="mix-style-container" style={{marginTop: '10px'}}>
                            <div style={{padding: '10px 0'}}>MIX STYLE</div>
                            <div className="checkboxes">
                                {mixStyle.map(value => <Checkbox {...value} key={value.id}/>)}
                            </div>
                        </div>
                        <div className="purpose-container" style={{marginBottom: '25px'}}>
                            <p style={{padding: '20px 0'}}>Choose if will be used in Competitions or Not:</p>
                            <div className="checkboxes">
                                <input type="radio" id="competition" name='purpose' value={"Competition"}/>
                                <label htmlFor="competition">Competition</label>
                                <input type="radio" id="non-competition" name='purpose' value={"Non-competition"}/>
                                <label htmlFor="non-competition">Non-competition</label>
                            </div>
                        </div>
                        
                        <InputField {...inputs[11]} min={minDate} />
                        
                        <div style={{padding: '20px 0'}}>MESSAGE</div>
                        <div className="textarea-container">
                            <textarea name="message" id="" placeholder='You can list here your ideas, specifications for the mix, and other information needed.'></textarea>
                        </div>

                        <div className="found-container" style={{marginBottom: '20px'}}>
                            <div style={{padding: '10px 0'}}>How did you hear about 5th Block Studios?</div>
                            <div className="checkboxes">
                                {found.map(value => <Checkbox {...value} key={value.id}/>)}
                            </div>
                        </div>

                        <p style={{fontSize: "14px"}}>Prove you are a human:</p>
                        <ReCAPTCHA className="g-recaptcha" sitekey="6LdSxKYrAAAAAFjLbQUtvK5GQ1UXJ1P0OCWJ7PCZ"  // 6LfjEGgrAAAAALy6KACOqMA6-m0HL4l1g9xVzlFy
                            onChange={recaptchaOnChange}/>
                        
                        <div className="submit-btn-container">
                            <input className="white-btn big-btn submit-custom" type="submit" value={"Send Request"} disabled={!capchtaValue || isLoading}/>
                            <p style={{color: 'red'}}>{submitError.error && submitError.errorMsg}</p>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
        }
        {isLoading && <LoadingScreen/>}
        {submitStatus && 
            <div className="done section" style={{alignText: 'center'}}>
                <div>
                    <p className="headings">Your request has been submitted</p>
                    <p>We sent a message to your email.</p>
                    <a href="/home">Go back to home page</a>
                </div>
                <i class="bi bi-check-circle-fill"></i>
            </div>
        }
        <Footer/>
        
        </>
    )
}