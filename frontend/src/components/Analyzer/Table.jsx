import React, {useEffect, useState} from 'react'
import first from "../../images/first.gif"
import previous from "../../images/previous.gif"
import next from "../../images/next.gif"
import last from "../../images/last.gif"
import s from './Analyzer.module.css'

const Table = (props) => {
    const [sortColumn, setSortColumn] = useState(null)
    const [pageSize, setPageSize] = useState(15)
    const [pageCount, setPageCount] = useState()
    const [pages, setPages] = useState()
    const [page,setPage] = useState(0)

    useEffect(() => {
        setPage(0)
        setPageCount(Math.ceil(props.words.length / pageSize))
        setPages([...Array(pageCount).keys()].map(i =>
            sortData(props.words).slice(i * pageSize, (i + 1) * pageSize)))
    }, [pageSize, pageCount, sortColumn, props])

    const sortData = (data) => {
        if (sortColumn === null) {
            // если столбец не выбран, вернуть несортированные данные
            return data;
        }

        return data.sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
            return 0;
        });
    };

    return (
        <div>
            <table cellPadding="0" cellSpacing="0" border="0" id="table" className={s.table} style={{width: "100%"}}>
                <thead>
                    <tr>
                        <th><p>#</p></th>
                        <th style={{cursor: "pointer"}} onClick={() => setSortColumn("word")} ><p>Слово</p></th>
                        <th style={{ cursor: "pointer" }} onClick={() => setSortColumn("count")}><p>Кол-во</p></th>
                        <th><p>% в ядре</p></th>
                        <th><p>% в тексте</p></th>
                    </tr>
                </thead>
                <tbody>
                    {pages ? pages[page].map((word, i) => (
                        <tr key={word.word}>
                            <td>{i+1}</td>
                            <td>{word.word}</td>
                            <td>{word.count}</td>
                            <td>{(word.count * 100 / props.analyzeInfo.dictionary[1].length).toFixed(1)}%</td>
                            <td>{(word.count * 100 / props.analyzeInfo.num_words).toFixed(1)}%</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
            <div className={s.controls}>
                <div className={s.perpage}>
                    <select defaultValue={pageSize} onChange={(e) => setPageSize(e.target.value)} >
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                    <span> элементов в таблице</span>
                </div>
                <div className={s.navigation}>
                    <img src={first} style={{ width: 16, height: 16, cursor: "pointer" }} alt="First Page" onClick={()=>setPage(0)}/>
                    <img src={previous} style={{ width: 16, height: 16, cursor: "pointer" }} alt="Prev Page" onClick={() => setPage(page <= 0 ? 0 : page - 1)} />
                    <img src={next} style={{ width: 16, height: 16, cursor: "pointer" }} alt="Next Page" onClick={() => setPage(page >= pageCount-1 ? pageCount-1 : page + 1)} />
                    <img src={last} style={{ width: 16, height: 16, cursor: "pointer" }} alt="Last Page" onClick={()=>setPage(pageCount-1)} />
                </div>
                <div id="text">Страница: <span id="currentpage">{page+1}</span> из <span id="pagelimit">{pageCount}</span></div>
            </div>
        </div>
    )
}

export default Table