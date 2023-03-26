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
                        <form onSubmit={loginUser} className={s.loginForm}>
                            <input required type="text" name="username" placeholder='Введите имя пользователя' className={s.input}/>
                            <input required type="password" name='password' placeholder='Введите пароль' className={s.input} />
                            <input type="submit" className={s.button} value="Войти" />
                        </form>
                    }
                </div>
                {texts && texts.length != 0 ? <div className={s.textsSection}>
                    <p className={s.title}>Сохраненные результаты</p>
                    <div className={s.textsList}>
                        {texts.map(text => (
                            <TextCard key={text.id} text={text}/>
                        ))}
                    </div>
                </div> : null}
            </div>
        </div>
    )
}

export default Sidebar