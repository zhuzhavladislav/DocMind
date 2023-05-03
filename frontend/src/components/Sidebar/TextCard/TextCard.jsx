import React, { useContext } from 'react'
import AuthContext from '../../../context/AuthContext';
import SidebarContext from '../../../context/SidebarContext';
import s from './TextCard.module.css'

const TextCard = ({ text, getTexts}) => {
    console.log(text);

    const { setTextFromSidebar } = useContext(SidebarContext)
    const {authTokens} = useContext(AuthContext)

    const date = new Date(text.date);
    const localDateString = date.toLocaleString();
    const waterPercent = Math.round(text.stop_words.count / text.num_words * 100) + "%"

    const deleteCard = async (id) => {
        const response = await fetch(`http://localhost:8000/api/texts/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        if (response.status === 204) {
            alert("Удаление прошло успешно")
            getTexts()
        } else if (response.status === 404) {
            alert("Текст с указанным id не найден")
        } else {
            alert("Произошла ошибка")
        }
    }

    return (
        <div className={s.textCard}>
            <svg width="25px" height="25px" className={s.delete} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" onClick={() => { deleteCard(text.id) }}>
                <path fill="none" d="M9 7h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h3z" />
                <path stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7h-2M4 7h2m0 0h12M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7m-9-.5v0A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5v0" />
            </svg>
            <p className={s.date}>{localDateString}</p>
            <p className={s.text}>{text.text}</p>
            <div className={s.shortInfo}>
                <div className={s.progress}>
                    <p>Вода: {waterPercent}</p>
                    <span style={{ width: waterPercent, backgroundColor: "skyblue" }}></span>
                </div>
                <div className={s.progress}>
                    <p>{text.sentiment[0] < 0.45
                        ? "Позитивный"
                        : text.sentiment[0] > 0.55
                            ? "Негативный"
                            : "Нейтральный"
                    }</p>
                    <span style={{ width: "100%", backgroundColor: text.sentiment[0] > 0.55 ? "lightcoral" : text.sentiment[0] < 0.45 ? "darkseagreen" : "lightgray" }}></span>
                </div>
                <div className={s.load} onClick={() => setTextFromSidebar(text)}>
                    <p>Загрузить</p>
                </div>
            </div>

        </div>
    )
}

export default TextCard