import { createContext, useState } from "react";

const RegisterContext = createContext()

export default RegisterContext

export const RegisterProvider = ({children}) => {
    
    const [register, setRegister] = useState(false)

    const contextData = {
        register,
        setRegister,
    }

    return(
        <RegisterContext.Provider value={contextData}>
            {children}
        </RegisterContext.Provider>
    )
}