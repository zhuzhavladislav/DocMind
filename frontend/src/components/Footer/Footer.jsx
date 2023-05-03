import React from 'react'
import {Link} from 'react-router-dom'
import s from './Footer.module.css'

const Footer = () => {
    return (
        <footer>
            <p>zhuzha_vladislav@mail.ru</p>
            <div className={s.footerItems}>
                <Link to="/help">
                    Справка
                </Link>
                <Link to="/developers">
                    О разработчике
                </Link>
            </div>
            <div className={s.copyright}>
                <p>© 2023 DocAnalyze Перепечатка и использование любых материалов (текстовых и графических элементов),
                    допускается только с письменного разрешения.</p>
            </div>
        </footer>
    )
}

export default Footer