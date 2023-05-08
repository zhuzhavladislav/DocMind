import { createContext, useState } from "react";

const AlertContext = createContext()

export default AlertContext

export const AlertProvider = ({children}) => {
    const [alerts, setAlerts] = useState([])

    const contextData = {
        alerts,
        setAlerts
    }

    return (
        <AlertContext.Provider value={contextData}>
            {children}
        </AlertContext.Provider>

    )
}