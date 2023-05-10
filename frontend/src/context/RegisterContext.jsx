import { createContext, useState } from "react";

const RegisterContext = createContext()

export default RegisterContext

export const RegisterProvider = ({children}) => {
    
    const [isRegisterShow, setIsRegisterShow] = useState(false)

    const contextData = {
        isRegisterShow,
        setIsRegisterShow,
    }

    return(
        <RegisterContext.Provider value={contextData}>
            {children}
        </RegisterContext.Provider>
    )
}