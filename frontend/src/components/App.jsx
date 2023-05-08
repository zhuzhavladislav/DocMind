import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext";
import { LoginProvider } from "../context/LoginContext";
import { RegisterProvider } from "../context/RegisterContext";
import { AlertProvider } from "../context/AlertContext";
import './App.css';
import AppRouter from "./AppRouter";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import LoginModal from "./Login/LoginModal";
import RegisterModal from './Register/RegisterModal'
import Alert from "./Alert/Alert";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <AlertProvider >
          <LoginProvider>
            <RegisterProvider>
              <AuthProvider>
                <Header />
                <Alert />
                <AppRouter />
                <Footer />
                <LoginModal />
                <RegisterModal />
              </AuthProvider>
            </RegisterProvider>
          </LoginProvider>
        </AlertProvider>
      </BrowserRouter>
    </>

  );
};

export default App;
