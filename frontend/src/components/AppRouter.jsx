import React, {useContext} from 'react'
import { authRoutes, privateRoutes, publicRoutes } from "../routes"
import AuthContext from "../context/AuthContext";
import { Navigate, Routes, Route } from "react-router-dom"

const AppRouter = () => {
    const { user } = useContext(AuthContext)
    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
            ))}

            {!user ? authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
            )) : null}

            {user ? privateRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
            )) : null}

            <Route path='*' element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRouter