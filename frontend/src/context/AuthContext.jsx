import { createContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).username : null)
    const [id, setId] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).id : null)
    const [loading, setLoading] = useState(true)

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
            setId(jwt_decode(data.access).id)
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            alert(response.status)
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        setId(null)
        localStorage.removeItem('authTokens')
    }

    const updateToken = async () =>{
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens.refresh })
        })
        const data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access).username)
            setId(jwt_decode(data.access).id)
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }
        if(loading){
            setLoading(false)
        }
    }

    const contextData = {
        user,
        authTokens,
        id,
        loginUser,
        logoutUser
    }

    useEffect(()=>{
        if(loading && authTokens){
            updateToken()
        }

        const refreshTime = 1000*60*5
        const interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, refreshTime)
        return ()=> clearInterval(interval)
    },[authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}