import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext";
import { LoginProvider } from "../context/LoginContext";
import { RegisterProvider } from "../context/RegisterContext";
import './App.css';
import AppRouter from "./AppRouter";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import LoginModal from "./Login/LoginModal";
import RegisterModal from './Register/RegisterModal'


const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <LoginProvider>
            <RegisterProvider>
              <Header />
              <AppRouter />
              <LoginModal />
              <RegisterModal />
              <Footer />
            </RegisterProvider>
          </LoginProvider>
        </AuthProvider>
      </BrowserRouter>
    </>

  );
};

export default App;
