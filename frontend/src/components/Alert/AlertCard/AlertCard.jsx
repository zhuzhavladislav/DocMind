import React, { useContext, useState, useEffect } from 'react'
import s from "./AlertCard.module.css"
import AlertContext from '../../../context/AlertContext'

const AlertCard = ({id, message, type }) => {
    const [isVisible, setIsVisible] = useState();
    const [isHidden, setIsHidden] = useState();
    const {alerts, setAlerts} = useContext(AlertContext);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setIsVisible(true);
            const timer2 = setTimeout(() => {
                setIsVisible(false);
                hideCard()
            }, 6000)
            return () => clearTimeout(timer2)
        }, 100);
        return () => clearTimeout(timer1);
    }, []);

    const getStatusClass = () => {
        switch (type) {
            case "correct":
                return s.correct;
            case "error":
                return s.error;
            default:
                return s.info;
        }
    };

    const hideCard = () => {
        const timer3 = setTimeout(() => {
            setIsHidden(true);
            removeAlert(id);
        }, 500);

        return () => clearTimeout(timer3)
    }

    const removeAlert = id => {
        setAlerts(alerts => alerts.filter(alert => alert.id !== id)); // удаляем объект с указанным id из массива
    };
    
    return !isHidden ? (
        <div className={`${s.toast}  ${isVisible ? s.show : null}`}>
            <div className={s.toastContent}>
                <div className={`${s.check} ${getStatusClass()}`}>
                    {type === "correct" ? "✓" : type === "error" ? "!" : "i"}
                </div>
                <div className={s.message}>
                    <span className={s.text1}>
                        {type === "correct" ? "Успешно" : type === "error" ? "Ошибка" : "Инфо"}
                    </span>
                    <span className={s.text2}>{message}</span>
                </div>
                <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" className={s.close} onClick={() => {setIsVisible(false); hideCard()}}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg>
                <div className={`${s.progress} ${true ? s.show : null} ${getStatusClass()}`}></div>
            </div>
        </div>
    ) : null;
}

export default AlertCard