import React from "react";
import s from "./Developers.module.css";

const Developers = () => {
  
  return (
    <main className={s.page}>
      <div className={s.container}>
        <p>Самарский университет</p>
        <p>Кафедра программных систем</p>
        <p style={{ marginTop: 30 }}>
          Выпускная квалификационная работа
        </p>
        <p style={{ marginTop: 30 }}>
          Тема: «Разработка автоматизированной системы семантического 
        </p>
        <p>анализа текстов естественного языка на основе нейронных сетей»</p>
        <p style={{ marginTop: 30 }}>
          Разработчик: обучающийся группы 6415-020302D
        </p>
        <p>Жужа Владислав Сергеевич</p>
        <p style={{ marginTop: 30 }}>Самара 2023</p>
      </div>
    </main>
  );
};

export default Developers;
