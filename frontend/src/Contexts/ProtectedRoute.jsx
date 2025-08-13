import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

export default function ProtectedRoute({children}){
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated){
    return <Navigate to="/admin-login" replace={true}/>
  }

  return children;
}