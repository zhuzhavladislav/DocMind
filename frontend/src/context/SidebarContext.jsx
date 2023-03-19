import { createContext, useState, useEffect } from "react";

const SidebarContext = createContext()

export default SidebarContext

export const SidebarProvider = ({children}) => {
    
    const [sidebar, setSidebar] = useState(false)

    const handleSidebar = (visible) => {
        setSidebar(visible)
    }

    const contextData = {
        sidebar,
        handleSidebar
    }

    return(
        <SidebarContext.Provider value={contextData}>
            {children}
        </SidebarContext.Provider>
    )
}