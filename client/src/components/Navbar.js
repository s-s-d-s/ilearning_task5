import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom"

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav-wrapper blue lighten-2">
                <div className="brand-logo">ILearning</div>
                <ul id="nav-mobile" className="right hide-on-med-and-down oran">
                    <li><a href="/" onClick={logoutHandler}>Logout</a></li>
                </ul>
            </div>
        </nav>
    )
}