import React, { useContext, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import SidebarContext from '../../context/SidebarContext'
import s from './Sidebar.module.css'
import TextCard from './TextCard/TextCard'

const Sidebar = () => {
    const { user, authTokens, logoutUser, loginUser } = useContext(AuthContext)
    const { sidebar, handleSidebar } = useContext(SidebarContext)
    const [texts, setTexts] = useState()

    useEffect(() => {
        getTexts()
    }, [user, handleSidebar])

    const registerUser = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': e.target.email.value, 'username': e.target.username.value, 'password': e.target.password.value})
        })
        const data = await response.json()
        if (response.status === 200) {
            alert("Регистрация прошла успешно")
        } else {
            alert(data)
        }
    }

    const getTexts = async () => {
        if (authTokens) {
            const response = await fetch('http://localhost:8000/api/texts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            if (response.ok) {
                const data = await response.json()
                setTexts(data)
            } else {
                logoutUser()
            }
        } else {
            setTexts(null)
        }
    }

    return (
        <div className={s.sidebar + " " + (sidebar ? null : s.hidden)}>
            <div className={s.profile}>
                <div className={s.profileHeader}>
                    <p>Меню</p>
                    <p style={{ cursor: "pointer" }} onClick={() => handleSidebar(false)}>✕</p>
                </div>
                <div className={s.profileSection}>
                    {user
                        ?
                        <>
                            <p>Привет, {user}</p>
                            <Link className={s.button} to="/account" onClick={() => handleSidebar(false)}>Аккаунт</Link>
                            <button className={s.button} onClick={logoutUser}>Выйти из аккаунта</button>
                        </>
                        :
                        <div style={{display: "flex", flexDirection: "column", gap: 30}}>
                            <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                                <p>Войдите</p>
                                <form onSubmit={loginUser} className={s.loginForm}>
                                    <input required type="text" name="username" placeholder='Введите имя пользователя' className={s.input} />
                                    <input required type="password" name='password' placeholder='Введите пароль' className={s.input} />
                                    <input type="submit" className={s.button} value="Войти" />
                                </form>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <p>Или зарегистрируйтесь</p>
                                <form onSubmit={registerUser} className={s.loginForm}>
                                    <input required type="email" name="email" placeholder='Введите email' className={s.input} />
                                    <input required type="text" name="username" placeholder='Введите имя пользователя' className={s.input} />
                                    <input required type="password" name='password' placeholder='Введите пароль' className={s.input} />
                                    <input type="submit" className={s.button} value="Зарегистрироваться" />
                                </form>
                            </div>
                        </div>
                    }
                </div>
                {texts && texts.length != 0 ? <div className={s.textsSection}>
                    <p className={s.title}>Сохраненные результаты</p>
                    <div className={s.textsList}>
                        {texts.map(text => (
                            <TextCard getTexts={getTexts} key={text.id} text={text}/>
                        ))}
                    </div>
                </div> : null}
            </div>
        </div>
    )
}

export default Sidebar