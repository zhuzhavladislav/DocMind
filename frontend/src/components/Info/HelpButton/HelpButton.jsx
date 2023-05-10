import React from 'react'
import s from "./HelpButton.module.css";
import { Link } from "react-router-dom";

export default function HelpButton() {
  return (
    <Link to='/developers'>
      <div className={s.help}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Справка
      </div>
    </Link>
  );
}
