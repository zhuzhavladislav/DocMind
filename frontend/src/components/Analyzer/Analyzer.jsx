import React, { useEffect, useState, useContext, useRef } from 'react'
import s from './Analyzer.module.css'
import st from './Table/Table.module.css'
import axios from "axios";
import Table from './Table/Table';
import AuthContext from '../../context/AuthContext';
import SidebarContext from '../../context/LoginContext';
import AlertContext from '../../context/AlertContext';
import HelpButton from "../Info/HelpButton/HelpButton";

const Analyzer = () => {
  
  const { user, id, authTokens, logoutUser } = useContext(AuthContext)
  const { textFromSidebar, setTextFromSidebar } = useContext(SidebarContext)
  const { alerts, setAlerts } = useContext(AlertContext)
  const [text, setText] = useState("")
  const [analyzeInfo, setAnalyzeInfo] = useState()
  const [category, setCategory] = useState("noStopWords")
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState(0)
  const resultRef = useRef(null)
  const analyzeRef = useRef(null)

  //Формируем POST запрос к серверу Django, и получаем ответ в виде данных
  const analyzeText = (e, format) => {
    const startTime = performance.now();
    setIsLoading(true)
    const data = new FormData();
    if (e.target.files && e.target.files.length > 0) {
      // Файл был выбран, отправляем его содержимое на сервер
      const file = e.target.files[0]
      setText("");
      setAnalyzeInfo();
      data.append(`${format}`, file);
      document.getElementById("file1").value = ""
      document.getElementById("file2").value = ""
    } else if (text != "") {
      // Текст был введен пользователем, отправляем его на сервер
      data.append(`text`, text);
    } else {
      // Если ни файл, ни текст не были введены, выходим из функции
      setIsLoading(false);
      return;
    }

    // Отправляем данные на сервер
    axios
      .post('http://localhost:8000/api/analyze/', data)
      .then((res) => {
        setDuration(((performance.now() - startTime)/1000).toFixed(2))
        setAnalyzeInfo(res.data);
        setText(res.data.text)
        setIsLoading(false)
      })
      .catch((err) => {
        setAlerts([...alerts, { id: Date.now(), message: `${err.response?.data || 'Непредвиденная ошибка'}`, type: 'error' }])
        setIsLoading(false);
      });
  }

  const saveText = async () => {
    setIsLoading(true)
    if (authTokens) {
      axios
        .post('http://localhost:8000/api/texts/', { ...analyzeInfo, user: id, text }, {
          headers: {
            authorization: 'Bearer ' + String(authTokens.access)
          },
        })
        .then((res) => {
          setAlerts([...alerts, { id: Date.now(), message: "Проверка сохранена", type: 'correct' }])
          setIsLoading(false)
        })
        .catch((err) => {
          setAlerts([...alerts, { id: Date.now(), message: `${err.response?.data?.text || 'Непредвиденная ошибка'}`, type: 'error' }])
          setIsLoading(false);
        });
    } else {
      logoutUser()
    }
  }

  const clearResult = () => { // Временное-вечное решение
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    scrollToTop()

    if (window.pageYOffset === 0) {
      setAnalyzeInfo()
      setText("")
    }
    window.addEventListener('scroll', function scrollHandler() {
      if (window.pageYOffset === 0) {
        setAnalyzeInfo()
        setText("")
        window.removeEventListener('scroll', scrollHandler)
      }
    })
  }

  useEffect(() => {
    if (textFromSidebar) {
      setText(textFromSidebar.text)
      setAnalyzeInfo(textFromSidebar)
      setTextFromSidebar(null)
    }
  }, [textFromSidebar])

  useEffect(() => {
    if (analyzeInfo) {
      resultRef.current.scrollIntoView({ behavior: "smooth" }); // вызываем scrollIntoView() после установки analyzeInfo
    }
  }, [analyzeInfo])

  return (
    <main ref = { analyzeRef }  className={s.container}>
      <HelpButton />
      <section className={s.section}>
        <h1 style={{ alignSelf: "center" }}>Семантический анализ текста DocMind</h1>
        <div className={s.filesButtons}>
          <form>
            <input className={s.fileInput + " " + s.fileInput1} type="file" accept=".txt, .doc, .docx" name="file1" id="file1" onChange={e => analyzeText(e, "file")} />
            <label className={s.fileInputLabel + " " + s.fileInputLabel1} htmlFor="file1">Проанализировать текстовый файл (.txt, .doc)</label>
          </form>
          <form>
            <input className={s.fileInput + " " + s.fileInput2} type="file" accept=".wav" name="file2" id="file2" onChange={e => analyzeText(e, "audio")} />
            <label className={s.fileInputLabel + " " + s.fileInputLabel2} htmlFor="file2" >Проанализировать аудиофайл (.wav)</label>
          </form>
        </div>
        <textarea id="text" name="text" className={s.textInput} placeholder="Или можете ввести текст вручную..." value={text} onChange={e => { setText(e.target.value); setAnalyzeInfo() }}></textarea>
        <div className={s.analyzeButtons}>
          <button onClick={analyzeText} className={s.button}>Проанализировать</button>
          {analyzeInfo ? <button onClick={() => clearResult() } className={s.button}>Очистить результат</button> : null}
          {user && analyzeInfo ? <button onClick={saveText} className={s.button}>Сохранить результат</button> : null}
        </div>
      </section>
      <section ref={resultRef} className={analyzeInfo ? `${s.section} ${s.tableFade} ${s.show}` : `${s.section} ${s.tableFade}`}>
        <table cellPadding="0" cellSpacing="0" border="0" id="table" className={st.table}>
          <tbody>
            <tr>
              <td>Тематика ✨<div className={s.hint} data-tooltip="Автоматическое определение тематики">?</div></td>
              <td style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {analyzeInfo?.topic.map((topic, i) => (
                  topic.prob >= 0.1 
                  ? 
                  <span key={`id_${i}`} className={st.highlight}>
                    {topic.name} ({topic.prob}%)
                  </span>
                  :
                  null
                ))}
              </td>
            </tr>
            <tr>
              <td>Стиль текста ✨<div className={s.hint} data-tooltip="Автоматическое определение стиля текста">?</div></td>
              <td style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                <span className={st.highlight}>{analyzeInfo?.style}</span>
              </td>
            </tr>
            <tr>
              <td>Тональность ✨<div className={s.hint} data-tooltip="Выявление в тексте эмоционально окрашенной лексики">?</div></td>
              <td style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10 }}><span className={st.highlight}>{analyzeInfo?.sentiment[0] < 0.35
                ? "Позитивная"
                : analyzeInfo?.sentiment[0] > 0.65
                  ? "Негативная"
                  : "Нейтральная"
              }
                <div className={s.hint} data-tooltip={"Негативная (Вероятность: " + Math.round(analyzeInfo?.sentiment[0] * 100) + "%), Позитивная (Вероятность: " + Math.round(analyzeInfo?.sentiment[1] * 100) + "%)"}>?</div>
              </span>
              </td>
            </tr>
            <tr>
              <td>Количество символов с пробелами<div className={s.hint} data-tooltip="Количество символов в тексте ВКЛЮЧАЯ пробелы">?</div></td>
              <td>{analyzeInfo?.symbolsCount}</td>
            </tr>
            <tr>
              <td>Количество символов (без пробелов)<div className={s.hint} data-tooltip="Количество символов в тексте БЕЗ учета пробелов">?</div></td>
              <td>{analyzeInfo?.symbolsWithoutSpaceCount}</td>
            </tr>
            <tr>
              <td>Количество слов<div className={s.hint} data-tooltip="Общее количество слов в тексте">?</div></td>
              <td>{analyzeInfo?.wordsCount}</td>
            </tr>
            <tr>
              <td>Количество стоп-слов<div className={s.hint} data-tooltip="Общее количество слов не несущих информационную нагрузку">?</div></td>
              <td>{analyzeInfo?.stopWords.count}</td>
            </tr>
            <tr>
              <td>Водность<div className={s.hint} data-tooltip="Показывает процент слов не несущих информационную нагрузку (водность)">?</div></td>
              <td>{Math.round(analyzeInfo?.stopWords.count / analyzeInfo?.wordsCount * 100)}%</td>
            </tr>
            <tr>
              <td>Словарь<div className={s.hint} data-tooltip="Количество слов употребляющихся в тексте">?</div></td>
              <td>{analyzeInfo?.dictionary.withStopWords.length}</td>
            </tr>
            <tr>
              <td>Словарь ядра<div className={s.hint} data-tooltip="Количество РАЗНЫХ слов исключая стоп-слова">?</div></td>
              <td>{analyzeInfo?.dictionary.withoutStopWords.length}</td>
            </tr>
            <tr>
              <td>Время анализа</td>
              <td>{duration}с</td>
            </tr>
            
          </tbody>
        </table>
      </section>
      <section className={analyzeInfo ? `${s.section} ${s.tableFade} ${s.show}` : `${s.section} ${s.tableFade}`}>
        <div className={s.filter}>
          {analyzeInfo?.dictionary.withoutStopWords != 0 ? <><input type="radio" id="category1" name="category" value="noStopWords" checked={category == "noStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category1">Без стоп-слов</label></> : null}
          {analyzeInfo?.dictionary.withStopWords != 0 ? <><input type="radio" id="category2" name="category" value="withStopWords" checked={category == "withStopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category2">Со стоп-словами</label></> : null}
          {analyzeInfo?.stopWords.count != 0 ? <><input type="radio" id="category3" name="category" value="stopWords" checked={category == "stopWords"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category3">Стоп-слова</label></> : null}
          {analyzeInfo?.dictionary.withStopWords != 0 ? <><input type="radio" id="category4" name="category" value="dictionary" checked={category == "dictionary"} onChange={(e) => setCategory(e.target.value)} />
            <label htmlFor="category4">Словарь</label></> : null}
        </div>
        <div>
          {category == "noStopWords"
            ? <Table words={analyzeInfo?.dictionary.withoutStopWords} analyzeInfo={analyzeInfo} />
            : category == "withStopWords"
              ? <Table words={analyzeInfo?.dictionary.withStopWords} analyzeInfo={analyzeInfo} />
              : category == "stopWords"
                ? <Table words={analyzeInfo?.stopWords.list} analyzeInfo={analyzeInfo} />
                : category == "dictionary"
                  ? <textarea style={{ marginTop: 10, width: "100%", height: "200px", resize: "vertical" }} defaultValue={analyzeInfo?.dictionary.withStopWords.map((word, i) => i == 0 ? word.word : " " + word.word)}></textarea>
                  : null
          }
        </div>
      </section>
      <div className={isLoading ? `${s.loading} ${s.fade} ${s.show}` : `${s.loading} ${s.fade}`}><span className={s.loader}></span></div>
    </main>
  )
}

export default Analyzer