import React from 'react'
import first from "../../images/first.gif"
import previous from "../../images/previous.gif"
import next from "../../images/next.gif"
import last from "../../images/last.gif"
import s from './Analyzer.module.css'

const Table = (props) => {
    return (
        <>
            <table cellPadding="0" cellSpacing="0" border="0" id="table" className={s.sortable} style={{marginTop: 15}}>
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
                    {props.words.map((word, i) => (
                        <tr key={word.word}>
                            <td>{i+1}</td>
                            <td>{word.word}</td>
                            <td>{word.count}</td>
                            <td>{(word.count * 100 / props.analyzeInfo.dictionary[1].length).toFixed(1)}%</td>
                            <td>{(word.count * 100 / props.analyzeInfo.num_words).toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="controls">
                <div id="perpage">
                    <select onChange={(e) => calculateRange(e.target.value)} >
                        <option value="5">5</option>
                        <option value="10" selected="selected">10</option>
                        <option value="20">20</option>
                    </select>
                    <span> элементов в таблице</span>
                </div>
                <div id="navigation">
                    <img src={first} style={{ width: 16, height: 16 }} alt="First Page" />
                    <img src={previous} style={{ width: 16, height: 16 }} alt="First Page" />
                    <img src={next} style={{ width: 16, height: 16 }} alt="First Page" />
                    <img src={last} style={{ width: 16, height: 16 }} alt="Last Page" />
                </div>
                <div id="text">Страница: <span id="currentpage"></span> из <span id="pagelimit"></span></div>
            </div>
        </>
    )
}

export default Table