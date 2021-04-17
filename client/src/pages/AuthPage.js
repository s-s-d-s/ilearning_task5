import React, { useContext, useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hook"
import { useMessage } from "../hooks/message.hook"
import { AuthContext } from "../context/AuthContext"

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        username: null, email: null, password: null
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/register', 'POST', {...form})
            message(data.message)
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <div className="card blue lighten-2">
                    <div className="card-content white-text">
                        <span className="card-title">Welcome! LogIn or create new account</span>
                        <div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter username"
                                    id="username"
                                    type="text"
                                    name="username"
                                    className="black-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="username">Username</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="black-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="black-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                        </div>
                    </div>

                    <div className="card-action">
                      <button className="btn orange darken-3"
                              style={{marginRight: 10}}
                              disabled={loading}
                              onClick={loginHandler}>
                          LogIn
                      </button>
                        <button className="btn light-green accent-3"
                                onClick={registerHandler}
                                disabled={loading}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}