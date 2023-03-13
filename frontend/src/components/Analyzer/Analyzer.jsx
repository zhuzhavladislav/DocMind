import React, { useEffect, useState } from 'react'
import s from './Analyzer.module.css'
import axios from "axios";
import Table from './Table';

const Analyzer = () => {
  const [text, setText] = useState("")
  const [analyzeInfo, setAnalyzeInfo] = useState()
  const [category, setCategory] = useState("noStopWords")
  const [isLoading, setIsLoading] = useState(false)

  //Формируем POST запрос к серверу Django, и получаем ответ в виде данных
  const analyze = () => {
    setIsLoading(true)
    const data = new FormData()
    data.append('text', text)
    axios
      .post("http://localhost:8000/api/analyze/", data)
      .then(res => {
        setAnalyzeInfo(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        alert(err)
      });
  }

  return (
    <div className={s.container}>
      {isLoading ? <div className={s.loading}>Loading</div> : null}
      <h1 style={{ marginTop: 20 }}>Семантический анализ текста <span className={s.highlight}>DocAnalyze</span></h1>
      <div className={s.textAnalyze}>
        <textarea id="text" name="text" className={s.textInput} placeholder="Напишите текст..." onChange={e => setText(e.target.value)}></textarea>
        <button onClick={analyze}>Проанализировать</button>
      </div>
      {analyzeInfo ?
        <div style={{ display: "flex", width: "60vw", flexDirection: "column", gap: 20, marginTop: 20, justifyContent: "center", flexWrap: "wrap", transition: "all 0.2s" }} className={s.fade}>
          <div className={s.filter}>
            {analyzeInfo.dictionary[1] != 0 ? <><input type="radio" id="category1" name="category" value="noStopWords" checked={category =="noStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category1">Без стоп-слов</label></> : null}
            {analyzeInfo.dictionary[0] != 0 ? <><input type="radio" id="category2" name="category" value="withStopWords" checked={category == "withStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category2">Со стоп-словами</label></> : null}
            {analyzeInfo.stop_words[0] != 0 ? <><input type="radio" id="category3" name="category" value="stopWords" checked={category == "stopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category3">Стоп-слова</label></> : null}
            {analyzeInfo.dictionary[1] != 0 ? <><input type="radio" id="category4" name="category" value="dictionary" checked={category == "dictionary"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category4">Словарь</label></> : null}
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            {category == "noStopWords"
              ? <Table words={analyzeInfo.dictionary[1]} analyzeInfo={analyzeInfo} />
              : category == "withStopWords"
                ? <Table words={analyzeInfo.dictionary[0]} analyzeInfo={analyzeInfo} />
                : category == "stopWords"
                  ? <Table words={analyzeInfo.stop_words[0]} analyzeInfo={analyzeInfo} />
                  : category == "dictionary"
                    ? <textarea style={{ marginTop: 10 }} value={ analyzeInfo.dictionary[1].map((word, i) => i==0 ? word.word : " " + word.word) }></textarea>
                    : null
            }
            <table cellPadding="0" cellSpacing="0" border="0" id="table" className={s.table}>
              <thead>
                <tr>
                  <th><p>Параметр</p></th>
                  <th><p>Значение</p></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Количество символов с пробелами<div className={s.hint} data-tooltip="Количество символов в тексте ВКЛЮЧАЯ пробелы">?</div></td>
                  <td>{analyzeInfo.num_symbols}</td>
                </tr>
                <tr>
                  <td>Количество символов (без пробелов)<div className={s.hint} data-tooltip="Количество символов в тексте БЕЗ учета пробелов">?</div></td>
                  <td>{analyzeInfo.num_symbols_without_space}</td>
                </tr>
                <tr>
                  <td>Количество слов<div className={s.hint} data-tooltip="Общее количество слов в тексте">?</div></td>
                  <td>{analyzeInfo.num_words}</td>
                </tr>
                <tr>
                  <td>Количество стоп-слов<div className={s.hint} data-tooltip="Общее количество слов не несущих информационную нагрузку">?</div></td>
                  <td>{analyzeInfo.stop_words[1]}</td>
                </tr>
                <tr>
                  <td>Водность<div className={s.hint} data-tooltip="Показывает процент слов не несущих информационную нагрузку (водность)">?</div></td>
                  <td>{Math.round(analyzeInfo.stop_words[1] / analyzeInfo.num_words * 100)}%</td>
                </tr>
                <tr>
                  <td>Словарь<div className={s.hint} data-tooltip="Количество слов употребляющихся в тексте">?</div></td>
                  <td>{analyzeInfo.dictionary[0].length}</td>
                </tr>
                <tr>
                  <td>Словарь ядра<div className={s.hint} data-tooltip="Количество РАЗНЫХ слов исключая стоп-слова">?</div></td>
                  <td>{analyzeInfo.dictionary[1].length}</td>
                </tr>
                <tr>
                  <td>Тематика<div className={s.hint} data-tooltip="Автоматическое определение тематики">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_native_bayes}<div className={s.hint} data-tooltip="Наивный байесовский классификатор">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_sgd}<div className={s.hint} data-tooltip="Метод опорных векторов">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_logistic_regression}<div className={s.hint} data-tooltip="Логистическая регрессия">?</div></td>
                </tr>
                <tr>
                  <td>Тональность<div className={s.hint} data-tooltip="Выявление в тексте эмоционально окрашенной лексики">?</div></td>
                  <td>{analyzeInfo.sentiment[0][0] < 0.45
                    ? "Позитивная"
                    : analyzeInfo.sentiment[0][0] > 0.55
                      ? "Негативная"
                      : "Нейтральная"
                  }
                    <div className={s.hint} data-tooltip={"Негативная (Вероятность: " + Math.round(analyzeInfo.sentiment[0][0] * 100) + "%), Позитивная (Вероятность: " + Math.round(analyzeInfo.sentiment[0][1] * 100) + "%)"}>?</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        :
        null
      }
    </div>
  )
}

export default Analyzer