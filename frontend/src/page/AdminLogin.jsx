
import '../styles/adminLogin.css'
import Logo from '../Components/Logo'
import axios from 'axios'
import { useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../Hooks/useAuth.jsx'
import useAPI from '../Hooks/useAPI'


export default function AdminLogin(){
    const api = useAPI()
    const {isAuthenticated, accessToken, login, authLoading} = useAuth()
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    if (isAuthenticated){
        return <Navigate to="/admin" replace={true}/>
    }

    //Login Handle
    async function loginHandle(e){
        setError(null)
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const username = formData.get('username')
        const password = formData.get('password')
        
        const success = await login(username, password)
        if (!success.success){
            setError(success.errMessage)
        }
        else{
            navigate("/admin")
        }
        
    }

    return(
        <div className='login-container'>
            <div className="login-wrapper">
            <Logo style = {{display: 'block', marginBottom: '20px'}}/>
            <p className='title'>Admin Login</p>
                <form action="login-form" onSubmit={loginHandle}>
                    <div className="input-wrapper">
                        <input type="text" name="username" id="username" placeholder='username/email'/>
                    </div>
                    <div className="input-wrapper">
                        <input type="password" name="password" id="password" placeholder='password'/>
                    </div>
                    <button type="submit "className='login-btn'>Login</button>
                </form>
                <div style={{color: "red",marginTop: '10px'}}>{error && error}</div>
            </div>
        </div>
    )
}