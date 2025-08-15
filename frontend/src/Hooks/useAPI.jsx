import axios from 'axios'


export default function useAPI(){
    const api  = axios.create({
        baseURL: `https://fivethblockstudio.onrender.com/api`,
        withCredentials: true,
        
    })
    
    return api
}

