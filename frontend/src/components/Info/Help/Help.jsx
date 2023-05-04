import React from "react";
import s from "./Help.module.css";

const Help = () => {
  return (
    <div className={s.help}>
      <ul style={{ marginTop: 20 }}>
        <li component="div">
          <a href="#h1_1">
            Автоматизированная система семантического анализа текстов естественного языка на основе нейронных сетей
          </a>
        </li>
        <li>
          <a href="#h2_1">Введение</a>
          <ul>
            <li>
              <a href="#h3_1">Авторизация, запуск приложения</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#h2_2">Режим администратора</a>
          <ul>
            <li>
              <a href="#h3_2">Панель администратора</a>
              <ul>
                <li>
                  <a href="#h4_2">Настройка уровня сложности</a>
                </li>
                <li>
                  <a href="#h4_2_2">Создание игры</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <a href="#h2_3">Режим игрока</a>
          <ul>
            <li>
              <a href="#h3_3">Параметры игры «Puzzle»</a>
            </li>
            <li>
              <a href="#h3_2_3">Игра «Puzzle»</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#h2_4">Завершить</a>
          <ul>
            <li>
              <a href="#h3_4">Смена пользователя</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#h2_5">Выход</a>
          <ul>
            <li><a href="#h3_5">Выход из программы</a></li>
          </ul>
        </li>
      </ul>

      <h1 id="h1_1">
        Автоматизированная система семантического анализа текстов естественного языка на основе нейронных сетей
      </h1>
      <h2 id="h2_1">Введение</h2>
      <p>
        Система «Puzzle» – система игры, позволяющая выбрать пазл и собрать его.
        Программа поддерживает работу двух видов пользователей: администратора и
        игрока.
      </p>
      <p>
        Для сборки пользователям-игрокам предлагаются упражнения разного уровня
        сложности. Пользователю-администратору доступны средства настройки
        пазла, такие как уровень сложности, количетсво фрагментов по горизонтали
        и вертикали, тип фрагментов, тип сборки пазла и изображение.
      </p>
      <p>
        Программа представляет собой веб-приложение, использующее базу данных
        Firebase в качестве хранилищища необходимых для работы даннных.э
        Программная система совместима с Windows XP, Windows Vista. Системные
        требования: 4Gb оперативной памяти, 1Gb жесткого диска.
      </p>
      <h3 id="h3_1">Авторизация, запуск программы</h3>
      <p>
        Данная программная система состоит из двух частей: для обслуживания
        игроков и администраторов. При запуске программной системы появляется
        окно авторизации, представленное на рисунке. В поля "Логин" и "Пароль"
        необходимо ввести данные зарегестрированного пользователя и нажать
        кнопку "Войти".
      </p>
      <img alt="Экранная форма авторизации" />
      <p>
        Если пользователь нажал на кнопку зарегистрироваться, то появляется окно
        регистрации, представленное на рисунке. В поля "Логин" и "Пароль"
        необходимо ввести данные нового пользователя и нажать кнопку
        "Зарегистрироваться".
      </p>
      <img alt="Экранная форма Регистрации" />
      <p>
        Если данные введены верно, то система выдаст форму настройки параметров
        для определенной роли.
      </p>
      <p>Основными функциями администратора являются:</p>
      <ul>
        <li>добавление нового уровня сложности;</li>
        <li>настройка уровня сложности;</li>
        <li>создание игры.</li>
      </ul>
      <p>К функциям игрока можно отнести:</p>
      <ul>
        <li>выбор уровня сложности;</li>
        <li>выбор игры (новая, существующая);</li>
        <li>настройка параметров;</li>
        <li>сборка пазла;</li>
        <li>сохранение игры в БД;</li>
      </ul>
      <p>Функции системы:</p>
      <ul>
        <li>
          аутентификация пользователя в системе, настройка интерфейса
          пользователя на заданную роль;
        </li>
        <li>автоматическое составление пазла по заданным параметрам;</li>
        <li>формирование списка игр для заданного уровня сложности;</li>
        <li>сохранение игры в БД;</li>
        <li>загрузка игры из БД;</li>
        <li>визуализация процессов работы с пазлом;</li>
        <li>проверка правильности сборки пазла;</li>
        <li>выдача справочной информации о системе</li>
      </ul>
      <h2 id="h2_2">Режим администратора</h2>
      <p>
        Данный раздел приложения служит для настройки уровня сложности и
        создания игры пазл
      </p>
      <h3 id="h3_2">Панель администратора</h3>
      <p>
        На панели администратора находятся кнопки "Настроить уровня сложности",
        "Создать игру", "Выйти из аккаунта", на которые нужно нажать для
        открытия соответствующего экрана.
      </p>
      <img alt="панель администратора" />
      <h4 id="h4_2">Настройка уровня сложности</h4>
      <p>
        Данный раздел предназначен для настройки уровня сложности игры пазл, в
        котором в выпадающих списках можно выбрать уровень сложности, вид
        фрагемнтов и тип сборки, а с помощью ползунков количество фрагментов по
        горизонтали и вертикали. После задания всехв вышеперечисленных
        параметров необходимо нажать кнопку "Применить" для сохранения настройки
        уровня сложности и кнопку "Закрыть", чтобы вернуться на панель
        администратора.
      </p>
      <img alt=" экран настройки уровня сложности" />
      <h4 id="h4_2_2">Создание игры</h4>
      <p>
        Для создания игры нужно ввести ее название, загрузить изображение для
        пазла и выбрать уровень сложности, после чего появится предварительная
        сетка пазла с заданными параметрами и кнопки "Перемешать" для
        перемешивания фрагментов пазла и кнопка "Сохранить" для сохранения
        созданной игры, которая после создания будет доступна в режиме
        пользователя. Для возврата на панель администратора необходимо нажать
        кнопку "Закрыть".
      </p>
      <img alt="экран создания игры" />
      <h2 id="h2_3">Режим игрока</h2>
      <p>
        При авторизации в качестве игрока пользователю отображается страница
        "Параметры игры «Puzzle»".
      </p>
      <h3 id="h3_3">Параметры игры «Puzzle»</h3>
      <p>
        Игрок в выпадающих списках может выбрать уровень сложности, которые
        загружаются из БД, а также тип игры (новая или существующая). На основе
        этих двух выборов ему выдаётся список доступных игр, из которых игрок
        выбирает нужную игру. Также ему доступнен выбор подсчета результата игры
        (не ведется, на очки, на время).
      </p>
      <img
        alt="Экранная форма настройки параметров игры у игрока"
      />
      <p>
        После выбора всех параметров игроку будет доступна кнопка начать игру,
        по нажатию на которую он попадёт на страницу сборки пазла.
      </p>
      <h3 id="h3_2_3">Игра «Puzzle»</h3>
      <p>
        В зависимости от выбора игрока ему будет доступна сборка на ленте или на
        поле. В процессе игры пользователь может перетаскивать фрагменты, меняя
        их местами.
      </p>
      <p>
        При нажатии на кнопку "🔊" игрок включит/отключит музыкальное
        сопровождение.
      </p>
      <p>
        При нажатии на кнопку "🖼️" игроку отобразится подсказка в виде
        изображения.
      </p>
      <p>
        При нажатии на кнопку "💾" игрок может сохранить нынешний прогресс, для
        этого ему надо задать название сохранения.
      </p>
      <p>
        При нажатии на кнопку "Выйти из аккаунта" игрок попадёт на страницу
        авторизации.
      </p>
      <img
        style={{ borderWidth: 1, borderColor: "#00000", borderStyle: "solid" }}
        alt="Экранная форма игры «Puzzle»"
      />
      <p>
        После того как игрок собрал пазл, всплывает модальное окно с
        поздравлением и итоговым результатом, если был задан параметр (на очки
        или на время).
      </p>
      <img alt="Модальное окно завершения игры" />
      <p>
        После нажатия на копку "Завершить игру" пользователь попадёт на экран
        настройки параметров игры.
      </p>
      <h2 id="h2_4">Завершить</h2>
      <h3 id="h3_4">Смена пользователя</h3>
      <p>
        Для смены пользователя необходимо нажать кнопку "Выйти из аккаунта", в
        режиме администратора она находится на панели администратора, в режиме
        пользователя на экранах настройки параметров игры и на экране сборки
        пазла.
      </p>
      <h2 id="h2_5">Выход</h2>
      <h3 id="h3_5">Выход из программы</h3>
      <p>
        Выход из программы осуществляется закрытием вкладки с приложением в
        браузере
      </p>
    </div>
  );
};

export default Help;