import React, { useContext, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import SidebarContext from '../../context/SidebarContext'
import s from './Sidebar.module.css'

const Sidebar = () => {
    const { user, authTokens, logoutUser } = useContext(AuthContext)
    const { sidebar, handleSidebar } = useContext(SidebarContext)
    const [texts, setTexts] = useState()

    useEffect(() => {
        getTexts()
    }, [user])

    console.log(texts);

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
            }
        } else {
            setTexts(null)
        }
    }

    return (
        <div className={s.sidebar + " " + (sidebar ? null : s.hidden)}>
            <div className={s.profile}>
                <div className={s.profileHeader}>
                    <p>Профиль</p>
                    <p style={{ cursor: "pointer" }} onClick={() => handleSidebar(false)}>✕</p>
                </div>
                <div className={s.profileSection}>
                    {user
                        ?
                        <>
                            <p>Привет, {user}</p>
                            <button onClick={logoutUser}>Выйти из аккаунта</button>
                        </>
                        :
                        <Link className={s.button} to="/login" onClick={() => handleSidebar(false)}>Войти в аккаунт</Link>
                    }
                </div>
                {texts ? <div className={s.profileSection}>
                    {texts.map(text => (
                        <div className={s.textCard} key={text.id}>
                            <p>{text.text}</p>
                        </div>
                    ))}
                </div> : null}
            </div>
        </div>
    )
}

export default Sidebar