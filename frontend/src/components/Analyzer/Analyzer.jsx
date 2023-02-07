import React, { useEffect, useState } from 'react'
import s from './Analyzer.module.css'
import axios from "axios";
import first from "../../images/first.gif"
import previous from "../../images/previous.gif"
import next from "../../images/next.gif"
import last from "../../images/last.gif"

const Analyzer = () => {
  const [text, setText] = useState("")
  const [analyzeInfo, setAnalyzeInfo] = useState()

  //Формируем POST запрос к серверу Django, и получаем ответ в виде данных
  const analyze = () => {
    const data = new FormData()
    data.append('text', text)
    axios
      .post("http://localhost:8000/analyze", data)
      .then(res => {
        setAnalyzeInfo(res.data)
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }

  return (
    <div className={s.Container}>
      <textarea id="text" name="text" className={s.TextInput} placeholder="Напишите текст..." onChange={e => setText(e.target.value)}></textarea>
      <button onClick={analyze}>Проанализировать</button>
      {analyzeInfo ?
        <div style={{display: "flex", flexDirection: "column", gap: 10, marginTop: 20}}>
          <p>Количество символов с пробелами: {analyzeInfo.num_symbols}</p>
          <p>Количество символов (без пробелов): {analyzeInfo.num_symbols_without_space}</p>
          <p>Количество слов: {analyzeInfo.num_words}</p>
          <p>Количество стоп-слов: {analyzeInfo.stop_words[1]}</p>
          <p>Водность: {Math.round(analyzeInfo.stop_words[1]/analyzeInfo.num_words*100)}%</p>
          
          <p><strong>Тематика</strong></p>
          <p style={{marginLeft: 10}}>Наивный байесовский классификатор: {analyzeInfo.nb}</p>
          <p style={{marginLeft: 10}}>Метод опорных векторов: {analyzeInfo.sgd}</p>
          <p style={{marginLeft: 10}}>Логистическая регрессия: {analyzeInfo.logreg}</p>
          {/* <div className={s.list}>
            <input type="radio" id="category1" name="category" />
            <label for="category1" id="category1">Без стоп-слов</label>
            <input type="radio" id="category2" name="category" />
            <label for="category2" id="category2">Со стоп-словами</label>
            <input type="radio" id="category3" name="category" />
            <label for="category3" id="category3">Стоп слова</label>
            <input type="radio" id="category4" name="category" />
            <label for="category4" id="category4">Словарь</label>
          </div> */}

          <table cellPadding="0" cellSpacing="0" border="0" id="table" className={s.sortable}>
            <thead>
              <tr>
                <th className={s.nosort}><p>#</p></th>
                <th><p>Слово</p></th>
                <th><p>Кол-во</p></th>
                <th><p>% в ядре</p></th>
                <th><p>% в тексте</p></th>
              </tr>
            </thead>
            <tbody>
              {analyzeInfo.stop_words[0].map((word, i)=>(
                <tr key={word.word}>
                    <td>{i}</td>
                    <td>{word.word}</td>
                    <td>{word.count}</td>
                    <td>-</td>
                  <td>{(word.count * 100 / analyzeInfo.num_words).toFixed(1)}%</td>
                  </tr>
              ))}
            </tbody>
          </table>
          <div id="controls">
            <div id="perpage">
              <select>
                <option value="5">5</option>
                <option value="10" selected="selected">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span> элементов в таблице</span>
            </div>
            <div id="navigation">
              <img src={first} style={{width:16, height:16}} alt="First Page"/>
              <img src={previous} style={{ width: 16, height: 16 }} alt="First Page"/>
              <img src={next} style={{width:16, height:16}} alt="First Page"/>
              <img src={last} style={{width:16, height:16}} alt="Last Page"/>
            </div>
            <div id="text">Страница: <span id="currentpage"></span> из <span id="pagelimit"></span></div>
          </div>
        </div>
        :
        null
      }
    </div>
  )
}

export default Analyzer