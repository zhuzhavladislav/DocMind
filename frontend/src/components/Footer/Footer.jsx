import React from 'react'
import {Link} from 'react-router-dom'
import s from './Footer.module.css'

const Footer = () => {
    return (
        <footer>
            <div className={s.footerTop}>
                <p>DocAnalyze</p>
                <div>
                    <p>zhuzha_vladislav@mail.ru</p>
                </div>
            </div>
            <hr className={s.footerLine}></hr>
            <div className={s.footerItems}>
                <Link to="/">
                    О проекте
                </Link>
                <Link to="/">
                    О разработчике
                </Link>
                <Link to="/">
                    Мобильная версия
                </Link>
            </div>
            <hr className={s.footerLine}></hr>
            <div className={s.copyright}>
                <p>© 2023 DocAnalyze Перепечатка и использование любых материалов (текстовых и графических элементов),
                    допускается только с письменного разрешения.</p>
            </div>
        </footer>
    )
}

export default Footer