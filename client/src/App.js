import React from "react"
import 'materialize-css'
import { useRoutes } from "./routes"
import { BrowserRouter as Router } from "react-router-dom"
import { useLogin } from "./hooks/login.hook"
import { AuthContext } from "./context/AuthContext"
import { Navbar } from "./components/Navbar"

function App() {
    const { token, userId, login, logout } = useLogin()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated }}>
        <Router>
            { isAuthenticated && <Navbar />}
            <div className="container">
                { routes }
            </div>
        </Router>
        </AuthContext.Provider>
  );
}

export default App
