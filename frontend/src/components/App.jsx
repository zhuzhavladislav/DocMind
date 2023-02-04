import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { publicRoutes } from "../routes"
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
