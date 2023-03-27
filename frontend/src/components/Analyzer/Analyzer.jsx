import React, { useEffect, useState, useContext, useRef } from 'react'
import s from './Analyzer.module.css'
import st from './Table/Table.module.css'
import axios from "axios";
import Table from './Table/Table';
import AuthContext from '../../context/AuthContext';
import SidebarContext from '../../context/SidebarContext';
import loader from '../../images/loop-loading.gif'

const Analyzer = () => {
  const {user, id, authTokens, logoutUser} = useContext(AuthContext)
  const {textFromSidebar} = useContext(SidebarContext)
  const [text, setText] = useState("")
  const [analyzeInfo, setAnalyzeInfo] = useState()
  const [category, setCategory] = useState("noStopWords")
  const [isLoading, setIsLoading] = useState(false)

  const formRef = useRef(null);

  //Формируем POST запрос к серверу Django, и получаем ответ в виде данных
  const analyzeText = (e) => {
    setIsLoading(true)
    const data = new FormData();
    if (e.target.files && e.target.files.length > 0) {
      // Файл был выбран, отправляем его содержимое на сервер
      const file = e.target.files[0];
      data.append('file', file);
    } else if (text != "") {
      // Текст был введен пользователем, отправляем его на сервер
      data.append('text', text);
    } else {
      // Если ни файл, ни текст не были введены, выходим из функции
      setIsLoading(false);
      return;
    }

    // Отправляем данные на сервер
    axios
      .post('http://localhost:8000/api/analyze/', data)
      .then((res) => {
        setAnalyzeInfo(res.data);
        setText(res.data.text)
        formRef.current.reset();
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err);
      });
  }


  const saveText = async () => {
    setIsLoading(true)
    if (authTokens) {
      const response = await fetch('http://localhost:8000/api/texts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({ ...analyzeInfo, user: id, text})
      })
      if (response.ok) {
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } else {
      logoutUser()
    }
  }

  useEffect(()=>{
    if (textFromSidebar){
      setText(textFromSidebar.text)
      setAnalyzeInfo(textFromSidebar)
    }
  }, [textFromSidebar])

  return (
    <main className={s.container}>
      <div className={isLoading ? `${s.loading} ${s.fade} ${s.show}` : `${s.loading} ${s.fade}`}><img alt="loading" src={loader} /></div>
      <h1 style={{ marginTop: 20 }}>Семантический анализ текста DocAnalyze</h1> 
      <div className={s.inputFiles}>
        <form ref={formRef}>
          <input className={s.inputFile + " " +s.inputFile1} type="file" accept=".txt, .doc, .docx" name="file1" id="file1" onChange={(e) => { setText(""); analyzeText(e) }} />
          <label className={s.inputFileLabel + " " + s.inputFileLabel1} htmlFor="file1">Текстовый файл (.txt, .doc)</label>
        </form>
        <form ref={formRef}>
          <input className={s.inputFile + " " + s.inputFile2} type="file" name="file2" id="file2" onChange={(e) => { setText(""); analyzeText(e) }} />
          <label className={s.inputFileLabel + " " + s.inputFileLabel2} htmlFor="file2" >Аудиофайл (.mp3, .wav)</label>
        </form>
      </div>
      <div className={s.textAnalyze}>
        <textarea id="text" name="text" className={s.textInput} placeholder="Или можете ввести текст вручную..." value={text} onChange={e => {setText(e.target.value); setAnalyzeInfo()}}></textarea>
        <div style={{display: "flex", gap: 20}}>
          <button onClick={analyzeText} className={s.button}>Проанализировать</button>
          {analyzeInfo ? <button onClick={() => { setText(""); setAnalyzeInfo(); formRef.current.reset(); }} className={s.button}>Очистить результат</button> : null}
          {user && analyzeInfo ? <button onClick={saveText} className={s.button}>Сохранить результат</button> : null}
        </div>
      </div>
      {analyzeInfo ?
        <div className={s.analyzeInfo}>
          <div className={s.filter}>
            {analyzeInfo.dictionary.without_stop_words != 0 ? <><input type="radio" id="category1" name="category" value="noStopWords" checked={category =="noStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category1">Без стоп-слов</label></> : null}
            {analyzeInfo.dictionary.with_stop_words != 0 ? <><input type="radio" id="category2" name="category" value="withStopWords" checked={category == "withStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category2">Со стоп-словами</label></> : null}
            {analyzeInfo.stop_words.count != 0 ? <><input type="radio" id="category3" name="category" value="stopWords" checked={category == "stopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category3">Стоп-слова</label></> : null}
            {analyzeInfo.dictionary.without_stop_words != 0 ? <><input type="radio" id="category4" name="category" value="dictionary" checked={category == "dictionary"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category4">Словарь</label></> : null}
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            {category == "noStopWords"
              ? <Table words={analyzeInfo.dictionary.without_stop_words} analyzeInfo={analyzeInfo} />
              : category == "withStopWords"
                ? <Table words={analyzeInfo.dictionary.with_stop_words} analyzeInfo={analyzeInfo} />
                : category == "stopWords"
                  ? <Table words={analyzeInfo.stop_words.list} analyzeInfo={analyzeInfo} />
                  : category == "dictionary"
                    ? <textarea style={{ marginTop: 10 }} defaultValue={ analyzeInfo.dictionary.without_stop_words.map((word, i) => i==0 ? word.word : " " + word.word) }></textarea>
                    : null
            }
            <table cellPadding="0" cellSpacing="0" border="0" id="table" className={st.table}>
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
                  <td>{analyzeInfo.stop_words.count}</td>
                </tr>
                <tr>
                  <td>Водность<div className={s.hint} data-tooltip="Показывает процент слов не несущих информационную нагрузку (водность)">?</div></td>
                  <td>{Math.round(analyzeInfo.stop_words.count / analyzeInfo.num_words * 100)}%</td>
                </tr>
                <tr>
                  <td>Словарь<div className={s.hint} data-tooltip="Количество слов употребляющихся в тексте">?</div></td>
                  <td>{analyzeInfo.dictionary.with_stop_words.length}</td>
                </tr>
                <tr>
                  <td>Словарь ядра<div className={s.hint} data-tooltip="Количество РАЗНЫХ слов исключая стоп-слова">?</div></td>
                  <td>{analyzeInfo.dictionary.without_stop_words.length}</td>
                </tr>
                <tr>
                  <td>Тематика<div className={s.hint} data-tooltip="Автоматическое определение тематики">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_native_bayes}<div className={s.hint} data-tooltip="Наивный байесовский классификатор">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_sgd}<div className={s.hint} data-tooltip="Метод опорных векторов">?</div></td>
                  <td style={{ display: "flex", width: "auto" }}>{analyzeInfo.semantic_logistic_regression}<div className={s.hint} data-tooltip="Логистическая регрессия">?</div></td>
                </tr>
                <tr>
                  <td>Тональность<div className={s.hint} data-tooltip="Выявление в тексте эмоционально окрашенной лексики">?</div></td>
                  <td>{analyzeInfo.sentiment[0] < 0.45
                    ? "Позитивная"
                    : analyzeInfo.sentiment[0] > 0.55
                      ? "Негативная"
                      : "Нейтральная"
                  }
                    <div className={s.hint} data-tooltip={"Негативная (Вероятность: " + Math.round(analyzeInfo.sentiment[0] * 100) + "%), Позитивная (Вероятность: " + Math.round(analyzeInfo.sentiment[1] * 100) + "%)"}>?</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        :
        null
      }
    </main>
  )
}

export default Analyzer