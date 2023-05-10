import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../../context/AuthContext';
import SidebarContext from '../../../context/LoginContext';
import AlertContext from '../../../context/AlertContext';
import axios from "axios";
import s from './ProfileTextCard.module.css'
import CircularProgress from '../../CircularProgress/CircularProgress';

const ProfileTextCard = ({ text, getTexts }) => {
    const navigate = useNavigate();
    const { setTextFromSidebar } = useContext(SidebarContext)
    const { authTokens } = useContext(AuthContext)
    const { alerts, setAlerts } = useContext(AlertContext)

    const date = new Date(text.date);
    const localDateString = date.toLocaleString();
    const water = Math.round(text.stopWords.count / text.wordsCount * 100)

    const deleteCard = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/texts/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });
            if (response.status === 204) {
                setAlerts([...alerts, { id: Date.now(), message: "Проверка удалена", type: 'correct' }])
                getTexts()
            } else if (response.status === 404) {
                setAlerts([...alerts, { id: Date.now(), message: "Проверка с указанным id не найден", type: 'error' }])
            } else {
                setAlerts([...alerts, { id: Date.now(), message: `Response code: ${response.status}, Data: ${response.data}`, type: 'error' }])
            }
        } catch (error) {
            setAlerts([...alerts, { id: Date.now(), message: error.message, type: 'error' }])
        }
    }


    return (
        <div className={s.textCard} onDoubleClick={() => { navigate(`/`); setTextFromSidebar(text) }}>
            <div className={s.top} >
                <p>{text.style} стиль</p>
                <p>В тексте {text.symbolsCount} символов(-а), {text.wordsCount} слова</p>
            </div>
            <p className={s.text}>{text.text}</p>
            <div className={s.bottom}>
                <div className={s.shortInfo}>
                    <CircularProgress progress={100 - water} dataTooltip={`Водность текста ${water}%`} />
                    <CircularProgress progress={Math.round(text.sentiment[1] * 100)} dataTooltip={"Тональность"} />
                    <p className={s.date}>{localDateString}</p>
                </div>
                <div className={s.miniButtons}>
                    <div onClick={() => { navigate(`/`); setTextFromSidebar(text) }} >
                        <p>Загрузить</p>
                    </div>
                    <div onClick={() => { deleteCard(text.id) }} >
                        <p>Удалить</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfileTextCard