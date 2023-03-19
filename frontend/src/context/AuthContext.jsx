import { createContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).username : null)

    const loginUser = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username':e.target.username.value,'password':e.target.password.value})
        })
        const data = await response.json()
        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access).username)
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            alert(response.status)
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}