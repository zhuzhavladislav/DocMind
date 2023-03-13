import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import s from './Header.module.css'

const Header = () => {
    const {user} = useContext(AuthContext)
    return (
        <header>
            <p>DocAnalyze</p>
            <nav className={s.menu}>
                <Link to="/">Главная</Link>
            </nav>
            <p>Привет, {user}</p>
        </header>
    )
}

export default Header