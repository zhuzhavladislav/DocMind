import { createContext, useState, useEffect } from "react";

const LoginContext = createContext()

export default LoginContext

export const LoginProvider = ({children}) => {
    
    const [isLoginShow, setIsLoginShow] = useState(false)
    const [textFromSidebar, setTextFromSidebar] = useState(null)

    const contextData = {
        textFromSidebar,
        setTextFromSidebar,
        isLoginShow,
        setIsLoginShow,
    }

    return(
        <LoginContext.Provider value={contextData}>
            {children}
        </LoginContext.Provider>
    )
}