import React from 'react'
import s from './Header.module.css'

const Header = () => {
    return (
        <header>
            <p>DocAnalyze</p>
            <nav className={s.menu}>
                <a href="/">Главная</a>
            </nav>
        </header>
    )
}

export default Header