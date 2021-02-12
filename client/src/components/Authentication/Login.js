import React, { useState } from 'react'
import { FormControl, Form, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { loginUser, forgotPassword, useUserState, useUserDispatch } from '../../context' 
import { toast } from 'react-toastify'
import Button from '../Common/Button'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const dispatch = useUserDispatch()
    const { loading } = useUserState()
    const history = useHistory()

    const login = async (e) => {
        e.preventDefault()
        loginUser(dispatch, email, password)
            .then(() => history.push('/dashboard'))
            .catch(err => toast.error(err))
    }

    const requestForgotPassword = async (e) => {
        e.preventDefault()
        forgotPassword(dispatch, email)
            .then(() => toast.success('Email sent!'))
            .finally(() => setShowForgotPassword(false))
            .catch(() => toast.error('Error, please try again.'))
    }

    const isValid = !showForgotPassword? (email && password) : email

    const enterHandler = (e) => {
        if (e.key === "Enter") {
            !showForgotPassword? login(e) : requestForgotPassword(e)
        }
    }
    
    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword)
    }

    const loginForm = 
        <div className="login-container">
            <Col>
                <h1 className="login-header">Login</h1>
                <p className="login-message">Welcome! Login to start getting ready for that vacation...</p>
                <div className="login-form-container">
                    <Form className="justify-content-center">
                        <FormControl type="email" placeholder="Email" className="mt-2" onChange={(e) => setEmail(e.target.value)} onKeyPress={e => enterHandler(e)}/>
                        <FormControl type="password" placeholder="Password" className="mt-2" onChange={(e) => setPassword(e.target.value)} onKeyPress={e => enterHandler(e)}/>
                    </Form>
                </div>
                <div className="login-assistance-container">
                    <Link className="login-assistance-item" to="/register">Need to Register?</Link>
                    <Link className="login-assistance-item" to="/login" onClick={toggleForgotPassword}>Forgot Password?</Link>
                </div>
                <div className="login-button-container">
                    <Button style="btn--edit--solid" size="btn--small" radius={4} onClick={login} disabled={!isValid || loading}>Login</Button>
                </div>
            </Col>
        </div>

    const forgotPasswordForm = 
        <div className="login-container">
            <Col>
                <h1 className="login-header">Forgot Password</h1>
                <p className="login-message">Please provide your email and we'll send you a link to reset your password.</p>
                <div className="login-form-container">
                    <Form className="justify-content-center">
                        <FormControl type="email" placeholder="Email" className="mt-2" onChange={(e) => setEmail(e.target.value)} onKeyPress={e => enterHandler(e)}/>
                    </Form>
                </div>
                <div className="login-assistance-container">
                    <Link className="login-assistance-item" to="/login" onClick={toggleForgotPassword}>Back to login</Link>
                </div>
                <div className="login-button-container">
                    <Button style="btn--edit--solid" size="btn--small" radius={4} onClick={requestForgotPassword} disabled={!isValid || loading}>Reset</Button>
                </div>
            </Col>
        </div>

    return (
        !showForgotPassword? loginForm : forgotPasswordForm
    )
}

export default Login