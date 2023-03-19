import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import SidebarContext from '../../context/SidebarContext'
import s from './Sidebar.module.css'

const Sidebar = () => {
    const { user, logoutUser } = useContext(AuthContext)
    const { sidebar, handleSidebar } = useContext(SidebarContext)

    return (
        <div className={s.sidebar + " " + (sidebar ? null : s.hidden)}>
            <div className={s.profile}>
                <div className={s.profileHeader}>
                    <p>Профиль</p>
                    <p style={{cursor: "pointer"}} onClick={()=>handleSidebar(false)}>✕</p>
                </div>
                <div className={s.profileUser}>
                    {user
                        ?
                        <>
                            <p>Привет, {user}</p>
                            <button onClick={logoutUser}>Выйти из аккаунта</button>
                        </>
                        :
                        <Link className={s.button} to="/login" onClick={()=>handleSidebar(false)}>Войти в аккаунт</Link>
                    }

                </div>
            </div>
        </div>
    )
}

export default Sidebar