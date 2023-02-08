import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { publicRoutes } from "../routes"
import './App.css';
import Header from "./Header/Header";

const App = () => {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={Component} />
          ))}
        </Routes>
      </BrowserRouter>
    </>

  );
};

export default App;
