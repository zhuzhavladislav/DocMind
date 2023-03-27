import React from 'react'
import s from './Pagination.module.css'

const Pagination = ({ pageNumber, onPageChange, maxPages }) => {
    const handlePrevClick = () => {
        if (pageNumber==1){
            onPageChange(1)
        } else {
            onPageChange(pageNumber - 1);
        }
        
    }

    const handleNextClick = () => {
        if (pageNumber == maxPages) {
            onPageChange(maxPages)
        } else {
            onPageChange(pageNumber + 1);
        }
    }

    return (
        <div style={{display: "flex", alignContent: "center", flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center"}}>
            <button onClick={handlePrevClick} className={s.paginationButton}>❮</button>
            <p>{pageNumber} из {maxPages}</p>
            <button onClick={handleNextClick} className={s.paginationButton}>❯</button>
        </div>
    )
}

export default Pagination