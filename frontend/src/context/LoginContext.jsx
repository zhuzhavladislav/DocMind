import { createContext, useState, useEffect } from "react";

const LoginContext = createContext()

export default LoginContext

export const LoginProvider = ({children}) => {
    
    const [login, setLogin] = useState(false)
    const [textFromSidebar, setTextFromSidebar] = useState(null)

    const contextData = {
        textFromSidebar,
        setTextFromSidebar,
        login,
        setLogin,
    }

    return(
        <LoginContext.Provider value={contextData}>
            {children}
        </LoginContext.Provider>
    )
}