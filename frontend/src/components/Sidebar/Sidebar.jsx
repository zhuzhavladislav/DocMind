import React, { useContext, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import SidebarContext from '../../context/SidebarContext'
import Pagination from '../Pagination/Pagination'
import s from './Sidebar.module.css'
import TextCard from './TextCard/TextCard'

const Sidebar = () => {
    const { user, logoutUser, loginUser } = useContext(AuthContext)
    const { sidebar, setSidebar } = useContext(SidebarContext)

    const registerUser = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': e.target.email.value, 'username': e.target.username.value, 'password': e.target.password.value })
        })
        const textResponse = await response.json();
        alert(textResponse)
        loginUser(e)
    }

    return (
        <div className={s.sidebar + " " + (sidebar ? s.show : null)}>
            <div className={s.container + " " + (sidebar ? s.show : null)}>
                <div className={s.header}>
                    <p>Войти</p>
                    <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" className={s.close} onClick={()=>setSidebar(false)}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                </div>
                <div className={s.section}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <form onSubmit={(e)=>{ loginUser(e); setSidebar(false)}} className={s.loginForm}>
                                <input required type="text" name="username" placeholder='Введите имя пользователя' className={s.input} />
                                <input required type="password" name='password' placeholder='Введите пароль' className={s.input} />
                                <input type="submit" className={s.button} value="Войти" />
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar