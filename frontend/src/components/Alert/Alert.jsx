import React, { useContext } from 'react'
import s from "./Alert.module.css"
import AlertContext from '../../context/AlertContext'
import AlertCard from './AlertCard/AlertCard'



const Alert = () => {
    const { alerts } = useContext(AlertContext)
    return (
        <div className={s.alertContainer}>
            {alerts?.map(alert => <AlertCard key={alert.id} id={alert.id} message={alert.message} type={alert.type} />)}
        </div>
    )
}

export default Alert