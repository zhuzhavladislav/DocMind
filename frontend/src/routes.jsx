import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Analyzer from "./components/Analyzer/Analyzer"

export const publicRoutes = [
    {
        path: "/",
        Component: <Analyzer />
    },
]
export const authRoutes = [
    {
        path: "/login",
        Component: <Login />
    },
    {
        path: "/register",
        Component: <Register />
    },
]
export const privateRoutes = [
    
]