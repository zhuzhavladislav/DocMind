import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import LoginContext from '../../context/LoginContext'
import s from './LoginModal.module.css'

const Login = () => {
    const { loginUser } = useContext(AuthContext)
    const { login, setLogin } = useContext(LoginContext)

    return (
        <div className={s.modal + " " + (login ? s.show : null)}>
            <div className={s.container + " " + (login ? s.show : null)}>
                <div className={s.header}>
                    <p>Войти</p>
                    <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" className={s.close} onClick={() => setLogin(false)}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                </div>
                <div className={s.section}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <form onSubmit={(e)=>{ loginUser(e); setLogin(false)}} className={s.loginForm}>
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

export default Login