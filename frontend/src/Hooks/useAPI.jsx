import axios from 'axios'
import useAuth from './useAuth'


export default function useAPI(){
    //const { accessToken } = useAuth()
    const api  = axios.create({
        baseURL: `http://localhost:8888/api`,
        withCredentials: true,
        
    })
    
    return api
}

