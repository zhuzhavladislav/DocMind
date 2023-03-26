import React, {useEffect, useContext, useState} from 'react'
import AuthContext from '../../context/AuthContext'
import s from './Account.module.css'
import TextCard from '../Sidebar/TextCard/TextCard'

const Account = () => {
  const { user, authTokens } = useContext(AuthContext)
  const [texts, setTexts] = useState()

  useEffect(() => {
    getTexts()
  }, [user])

  const getTexts = async () => {
    if (authTokens) {
      const response = await fetch('http://localhost:8000/api/texts/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTexts(data)
      } else {
        logoutUser()
      }
    } else {
      setTexts(null)
    }
  }
  return (
    <main>
      {texts && texts.length != 0 ? <div className={s.textsSection}>
        <p className={s.title}>Сохраненные результаты</p>
        <div className={s.textsList}>
          {texts.map(text => (
            <TextCard key={text.id} text={text} />
          ))}
        </div>
      </div> : null}
    </main>
  )
}

export default Account