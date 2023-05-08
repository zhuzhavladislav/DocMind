import { createContext, useState, useEffect, useContext } from "react";
import jwt_decode from 'jwt-decode'
import RegisterContext from "./RegisterContext";
import LoginContext from "./LoginContext";
import AlertContext from "./AlertContext";
import axios from 'axios';

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).username : null)
    const [id, setId] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).id : null)
    const [email, setEmail] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')).email : null)
    const [loading, setLoading] = useState(true)
    const { register, setRegister } = useContext(RegisterContext)
    const {setLogin} = useContext(LoginContext)
    const { alerts, setAlerts } = useContext(AlertContext)

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                'username': e.target.username.value,
                'password': e.target.password.value
            });
            const data = response.data;
            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access).username);
                setId(jwt_decode(data.access).id);
                setEmail(jwt_decode(data.access).email);
                localStorage.setItem('authTokens', JSON.stringify(data));
                e.target.reset();
                setLogin(false);
                setAlerts([...alerts, { id: Date.now(), message: "Вы успешно авторизовались", type: 'correct' }]);
            }
        } catch (error) {
            const response = error.response;
            if (response.status === 401) {
                setAlerts([...alerts, { id: Date.now(), message: "Неверное имя пользователя или пароль", type: 'error' }]);
            } else {
                setAlerts([...alerts, { id: Date.now(), message: "Что-то пошло не так", type: 'error' }]);
            }
        }
    };


    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register/', {
                email: e.target.email.value,
                username: e.target.username.value,
                password: e.target.password.value
            });
            if (response.status === 201) {
                loginUser(e);
                setRegister(false);
                e.target.reset();
            }
        } catch (error) {
            console.log(error);
            const message = error.response.data;
            setAlerts([...alerts, { id: Date.now(), message: message, type: 'error' }]);
        }
    };


    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        setId(null)
        setEmail(null)
        localStorage.removeItem('authTokens')
        setAlerts([...alerts, { id: Date.now(), message: "Вы вышли из аккаунта", type: 'info' }])
    }

    const updateToken = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                'refresh': authTokens.refresh
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            if (response.status === 200) {
                setAuthTokens(data)
                setUser(jwt_decode(data.access).username)
                setId(jwt_decode(data.access).id)
                setEmail(jwt_decode(data.access).email)
                localStorage.setItem('authTokens', JSON.stringify(data))
            } else {
                logoutUser()
                setAlerts([...alerts, { id: Date.now(), message: "Сессия истекла. Выполнен выход из аккаунта.", type: 'info' }])
            }
            if (loading) {
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const contextData = {
        user,
        authTokens,
        id,
        email,
        loginUser,
        registerUser,
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