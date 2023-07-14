import Account from './components/Account/Account'
import Analyzer from "./components/Analyzer/Analyzer"
import Developers from "./components/Info/Developers/Developers"

export const publicRoutes = [
    {
        path: "/",
        Component: <Analyzer />
    },
    {
        path: "/developers",
        Component: <Developers />
    }
]
export const authRoutes = [

]
export const privateRoutes = [
    {
        path: "/account",
        Component: <Account />
    },
]