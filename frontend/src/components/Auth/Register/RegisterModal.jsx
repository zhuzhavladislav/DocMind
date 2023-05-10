import React, { useContext, useState } from 'react'
import AuthContext from '../../../context/AuthContext'
import RegisterContext from '../../../context/RegisterContext'
import s from './RegisterModal.module.css'

const Register = () => {
    const { registerUser } = useContext(AuthContext)
    const { isRegisterShow, setIsRegisterShow } = useContext(RegisterContext)
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('')

    return (
        <div className={s.modal + " " + (isRegisterShow ? s.show : null)}>
            <div className={s.container + " " + (isRegisterShow ? s.show : null)}>
                <div className={s.header}>
                    <p>Зарегистрироваться</p>
                    <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" className={s.close} onClick={() => setIsRegisterShow(false)}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                </div>
                <div className={s.section}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <form onSubmit={(e)=> {registerUser(e)}} className={s.loginForm}>
                                <div className={s.field}>
                                    <p>Email</p>
                                    <input required type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder='Введите email' className={s.input} />
                                </div>
                                <div className={s.field}>
                                    <p>Логин</p>
                                    <input required type="text" value={username} onChange={e=>setUsername(e.target.value)} pattern="^\w{4,15}$" name="username" placeholder='Введите логин' className={s.input} />
                                    {username.length < 4 || username.length > 15 ? (
                                        <label htmlFor="password">Логин должен быть длиной от 4 до 15 символов</label>
                                    ) : (
                                        null
                                    )}
                                </div>
                                <div className={s.field}>
                                    <p>Пароль</p>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" name='password' pattern="^\w{4,20}$" placeholder='Введите пароль' className={s.input} />
                                    {password.length < 4 || password.length > 20 ? (
                                        <label htmlFor="password">Пароль должен быть длиной от 4 до 20 символов</label>
                                    ) : (
                                        null
                                    )}
                                </div>
                                <input type="submit" className={s.button} value="Зарегистрироваться" />
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register