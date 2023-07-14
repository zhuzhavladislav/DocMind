import React from 'react'
import {Link} from 'react-router-dom'
import s from './Footer.module.css'

const Footer = () => {
    return (
        <footer>
            <div className={s.copyright}>
                <p>© 2023 DocMind Перепечатка и использование любых материалов (текстовых и графических элементов),
                    допускается только с письменного разрешения.</p>
            </div>
        </footer>
    )
}

export default Footer