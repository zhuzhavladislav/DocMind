import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import Pagination from '../Pagination/Pagination'
import s from './Account.module.css'
import axios from 'axios';
import ProfileTextCard from './ProfileTextCard/ProfileTextCard'
import AlertContext from '../../context/AlertContext';
import HelpButton from "../Info/HelpButton/HelpButton";

const Account = () => {
  const { user, email, authTokens, logoutUser } = useContext(AuthContext)
  const [texts, setTexts] = useState()

  const [pageSize, setPageSize] = useState(5)
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPages, setMaxPages] = useState(1)
  const [startIndex, setStartIndex] = useState(1)
  const [pageItems, setPageItems] = useState()
  const {alerts, setAlerts} = useContext(AlertContext)


  useEffect(() => {
    getTexts()
  }, [user])

  useEffect(() => {
    //Пагинация
    //Если тексты загрузились
    if (texts) {
      //Вычисляем максимальное количество страниц
      setMaxPages(Math.ceil(texts.length / pageSize))
      //Вычисляем начальный элемент на странице
      setStartIndex((pageNumber - 1) * pageSize)
      //Устанавливаем элементы на странице
      setPageItems(texts.slice(startIndex, startIndex + pageSize))
    }
  }, [texts, startIndex, pageSize, pageNumber])

  useEffect(() => {
    if (pageNumber > 1 && pageItems.length === 0) {
      // Если на текущей странице не осталось элементов, то переключиться на предыдущую страницу
      setPageNumber(pageNumber - 1);
    }
  }, [pageItems])

  const onPageChange = (pageNumber) => {
    setPageNumber(pageNumber)
  }

  const getTexts = async () => {
    try {
      if (authTokens) {
        const response = await axios.get('http://localhost:8000/api/texts/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
          }
        });
        setTexts(response.data);
      } else {
        setTexts(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      } else {
        setAlerts([...alerts, { id: Date.now(), message: `${error}`, type: 'error' }])
      }
    }
  }


  return (
    <main className={s.container}>
      <HelpButton />
      <section className={s.section}>
        <div className={s.profileContainer}>
          <div className={s.avatarContainer}>{user.charAt(0)}</div>
          <div className={s.infoContainer}>
            <p>Никнейм: {user}</p>
            <p>Email: {email}</p>
          </div>
        </div>
      </section>
      <section className={s.section}>
        <p className={s.title}>Мои проверки</p>
        {pageItems && pageItems.length != 0 ?
          <>
            <div className={s.texts}>
              {pageItems.map(text => (
                <ProfileTextCard getTexts={getTexts} onPageChange={onPageChange} pageNumber={pageNumber} key={text.id} text={text} />
              ))}
            </div>
            <Pagination pageNumber={pageNumber} onPageChange={onPageChange} maxPages={maxPages} />
          </>
          : 
          <p>
                Пока проверок нет :(
          </p>}
      </section>
    </main>
  )
}

export default Account