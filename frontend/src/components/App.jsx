import { useState } from "react";
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext";
import { SidebarProvider } from "../context/SidebarContext";
import './App.css';
import AppRouter from "./AppRouter";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Sidebar from "./SideBar/Sidebar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Header />
            <AppRouter />
            <Sidebar />
            <Footer />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </>

  );
};

export default App;
