import React, {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const Login = () => {
  const {loginUser} = useContext(AuthContext)
  return (
    
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder='Введите имя пользователя' />
        <input type="password" name='password' placeholder='Введите пароль' />
        <input type="submit"/>
      </form>
    </div>
  )
}

export default Login