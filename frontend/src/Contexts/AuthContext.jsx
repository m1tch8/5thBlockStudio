import { createContext, useEffect, useContext, useState, use } from "react";
import useAPI from "../Hooks/useAPI";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider(props){
    

    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    const api = useAPI();

    //LOGIN 
    const login = async (username,password) => { 

        setIsLoading(true)
        let errMessage, statusCode, success;
        
        await api.post("/user/login",{
            username,
            password
        }).then(response =>{
            const role = response.data.role;
            if (role !=="admin"){
                throw new Error("User is not Authorized");
            }
            success= true;
            statusCode = response.request.status;
            setIsAuthenticated(true)
            setAccessToken(response.data.accessToken)
            
        })
        .catch(err=>{
            success = false;
            errMessage = err.response?.data.message || err.message;
            statusCode = err.response?.status || 401;
            logout();
        })
        .finally(
            setIsLoading(false)
        );

        
        const output = {
            errMessage,
            statusCode,
            success
        }
        
        return output;
    }
    
    //LOGOUT
    const logout = async() => {
        try{
            setIsLoading(true)
            const request = await api.get("/user/logout");
            if(!request){
                throw new Error("something error");
            }
            setIsAuthenticated(false);
            setAccessToken(null)
        }
        catch(err){
            console.error(err.message)
            return false;
        }
        finally{
            setIsLoading(false)
        }

        return true;
    }
    
    //REFRESH FUNC
    const refresh = async() => {
        setIsLoading(true);
        let token;
        await api.get("user/refresh")
        .then(response =>{
            if (response.data.role !== "admin"){
                throw new Error("Unauthorized")
            }
            token = response.data.accessToken
            setAccessToken(response.data.accessToken)
            setIsAuthenticated(true);
        })
        .catch(error =>{
            console.error(error.response?.data.message || error.message)
            logout();
            return false
        })
        .finally(
            setIsLoading(false)
        )
        return token;
    }

    //AUTO RENEW REFRESH EVERY REFRESH
    useEffect(()=>{
        
        refresh();
        
    },[]);


    const value = {
        login,
        logout,
        isAuthenticated,
        accessToken,
        isLoading,
        setIsLoading,
        refresh
    }
    
    return(
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
    )
}