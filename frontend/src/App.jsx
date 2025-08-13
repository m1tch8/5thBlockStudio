import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from  "./page/Home.jsx"
import Request from  "./page/Request.jsx"
import Shop from  "./page/Shop.jsx"
import Outputs from  "./page/Outputs.jsx"
import NoPage from  "./page/NoPage.jsx"
import AdminLogin from "./page/AdminLogin.jsx"
import Admin from './page/Admin.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import { AuthProvider } from './Contexts/AuthContext.jsx'
import ProtectedRoute from './Contexts/ProtectedRoute.jsx'
import RequestMix from './page/RequestMix.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element ={<Home/>}/>
          <Route path="/home" element ={<Home/>}/>
          <Route path="/request" element ={<Request/>}/>
          <Route path="/shop" element ={<Shop/>}/>
          <Route path="/outputs" element ={<Outputs/>}/>
          <Route path="/requestmix" element ={<RequestMix/>}/>

          <Route path="/admin-login" element ={<AdminLogin/>}/>
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin/>
            </ProtectedRoute>
          }/>

          <Route path="*" element={<NoPage />}/>
        </Routes>
      </AuthProvider>
      
    </BrowserRouter>
  )
}

export default App
