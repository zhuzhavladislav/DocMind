import Account from './components/Account/Account'
import Analyzer from "./components/Analyzer/Analyzer"
import Developers from "./components/Info/Developers/Developers"
import Help from "./components/Info/Help/Help"

export const publicRoutes = [
    {
        path: "/",
        Component: <Analyzer />
    },
    {
        path: "/developers",
        Component: <Developers />
    },
    {
        path: "/help",
        Component: <Help />
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