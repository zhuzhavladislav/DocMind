import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import RegisterContext from '../../context/RegisterContext'
import s from './RegisterModal.module.css'

const Register = () => {
    const { registerUser } = useContext(AuthContext)
    const { register, setRegister } = useContext(RegisterContext)

    return (
        <div className={s.modal + " " + (register ? s.show : null)}>
            <div className={s.container + " " + (register ? s.show : null)}>
                <div className={s.header}>
                    <p>Зарегистрироваться</p>
                    <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" className={s.close} onClick={() => setRegister(false)}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                </div>
                <div className={s.section}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <form onSubmit={(e)=> {setRegister(false); registerUser(e)}} className={s.loginForm}>
                                <input required type="email" name="email" placeholder='Введите email' className={s.input} />
                                <input required type="text" name="username" placeholder='Введите имя пользователя' className={s.input} />
                                <input required type="password" name='password' placeholder='Введите пароль' className={s.input} />
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