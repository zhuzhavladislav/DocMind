import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext";
import './App.css';
import AppRouter from "./AppRouter";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
            <AppRouter />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>

  );
};

export default App;
