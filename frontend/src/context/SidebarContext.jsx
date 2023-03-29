import { createContext, useState, useEffect } from "react";

const SidebarContext = createContext()

export default SidebarContext

export const SidebarProvider = ({children}) => {
    
    const [sidebar, setSidebar] = useState(false)
    const [textFromSidebar, setTextFromSidebar] = useState(null)

    const contextData = {
        textFromSidebar,
        setTextFromSidebar,
        sidebar,
        setSidebar
    }

    return(
        <SidebarContext.Provider value={contextData}>
            {children}
        </SidebarContext.Provider>
    )
}