import React, { useEffect, useState } from 'react'
import s from './Analyzer.module.css'
import axios from "axios";

const Analyzer = () => {
  const [text, setText] = useState("")
  const [analyzeInfo, setAnalyzeInfo] = useState()

  //Формируем POST запрос к серверу Django, и получаем ответ в виде данных
  const analyze = () => {
    const data = new FormData()
    data.append('text', text)
    axios
      .post("http://localhost:8000/analyze", data)
      .then(res => setAnalyzeInfo(res.data))
      .catch(err => console.log(err));
  }

  return (
    <div className={s.Container}>
      <textarea id="text" name="text" className={s.TextInput} placeholder="Напишите текст..." onChange={e => setText(e.target.value)}></textarea>
      <button onClick={analyze}>Проанализировать</button>
      {analyzeInfo ?
        <div>
          <p>Количество слов: {analyzeInfo.wordcount}</p>
          <p>Полярность: {analyzeInfo.polarity}</p>
          <p>Тон: {analyzeInfo.analyzed_text}</p>
        </div>
        :
        null
      }
    </div>
  )
}

export default Analyzer