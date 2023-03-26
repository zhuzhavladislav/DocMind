import Account from './components/Account/Account'
import Analyzer from "./components/Analyzer/Analyzer"

export const publicRoutes = [
    {
        path: "/",
        Component: <Analyzer />
    },
]
export const authRoutes = [

]
export const privateRoutes = [
    {
        path: "/account",
        Component: <Account />
    },
]