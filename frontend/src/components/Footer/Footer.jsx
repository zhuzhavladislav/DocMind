import React from 'react'
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
                <a href="">
                    О проекте
                </a>
                <a href="">
                    О разработчике
                </a>
                <a href="">
                    Мобильная версия
                </a>
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