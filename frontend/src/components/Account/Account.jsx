import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import Pagination from '../Pagination/Pagination'
import s from './Account.module.css'
import ProfileTextCard from './ProfileTextCard/ProfileTextCard'

const Account = () => {
  const { user, authTokens } = useContext(AuthContext)
  const [texts, setTexts] = useState()

  const [pageSize, setPageSize] = useState(3)
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPages, setMaxPages] = useState(1)
  const [startIndex, setStartIndex] = useState(1)
  const [pageItems, setPageItems] = useState()

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
      {pageItems && pageItems.length != 0 ?
        <div className={s.textsSection}>
          <p className={s.title}>Сохраненные результаты</p>
          <div className={s.textsList}>
            {pageItems.map(text => (
              <ProfileTextCard getTexts={getTexts} onPageChange={onPageChange} pageNumber={pageNumber} key={text.id} text={text} />
            ))}
          </div>
          <Pagination pageNumber={pageNumber} onPageChange={onPageChange} maxPages={maxPages} />
        </div>
        : null}
    </main>
  )
}

export default Account