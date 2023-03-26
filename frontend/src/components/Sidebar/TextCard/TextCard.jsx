import React, {useContext} from 'react'
import SidebarContext from '../../../context/SidebarContext';
import s from './TextCard.module.css'

const TextCard = ({text}) => {
    const {setTextFromSidebar} = useContext(SidebarContext)

    const date = new Date(text.date);
    const localDateString = date.toLocaleString();
    const waterPercent = Math.round(text.stop_words.count / text.num_words * 100) + "%"
    
  return (
      <div className={s.textCard} onClick={()=>setTextFromSidebar(text)}>
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
          </div>
          
      </div>
  )
}

export default TextCard