import React, { useState } from 'react'
import { FormControl, Form, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { resetPassword, useUserState, useUserDispatch } from '../../context' 
import { toast } from 'react-toastify'
import Button from '../Common/Button'

const ResetPassword = (props) => {
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const dispatch = useUserDispatch()
    const { loading } = useUserState()
    const history = useHistory()

    const token = props.match.params.token

    const requestReset = async (e) => {
        e.preventDefault()
        resetPassword(dispatch, confirmPassword, token)
            .then(() => toast.success('Password reset. Please login with updated password.'))
            .then(() => history.push('/login'))
            .catch(err => toast.error(err))
    }

    const isValid = (password === confirmPassword)

    const enterHandler = (e) => {
        if (e.key === "Enter") {
            requestReset(e)
        }
    }
    
    const resetPasswordForm = 
        <div className="login-container">
            <Col>
                <h1 className="login-header">Reset Password</h1>
                <div className="login-form-container">
                    <Form className="justify-content-center">
                        <Form.Label>New Password</Form.Label>
                        <FormControl type="password" placeholder="Password" className="mt-2" onChange={(e) => setPassword(e.target.value)} onKeyPress={e => enterHandler(e)}/>
                        <Form.Label className="mt-3">Confirm New Password</Form.Label>
                        <FormControl type="password" placeholder="Confirm Password" className="mt-2" onChange={(e) => setConfirmPassword(e.target.value)} onKeyPress={e => enterHandler(e)}/>
                    </Form>
                </div>
                <div className="login-button-container">
                    <Button style="btn--edit--solid" size="btn--small" radius={4} onClick={requestReset} disabled={!isValid || loading}>Reset</Button>
                </div>
            </Col>
        </div>

    return (
        resetPasswordForm
    )
}

export default ResetPassword