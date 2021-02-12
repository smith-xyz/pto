import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useHistory, Link } from 'react-router-dom'
import UserService from '../../services/UserService'
import Button from '../Common/Button'
import { toast } from 'react-toastify'

const Register = () => {
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordCheck, setPasswordCheck] = useState()
    const [supervisor, setSupervisor] = useState()
    const [supervisors, setSupervisors] = useState([])
    const [validated, setValidated] = useState(false)

    const history = useHistory()

    useEffect(() => {
        getSupervisors()
    }, [])

    const getSupervisors = async () => {
        UserService.getSupervisors()
            .then(res => {
                setSupervisors(res.data)
            }).catch(err => new Error(err))
    }

    const supervisorsList = (
        supervisors.length > 0 && supervisors.map((list) => {
            return <option key={list.id} value={list.id}>{list.fullName}</option>
        })
    )

    const submit = async (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
            setValidated(true)
            toast.error('Missing required fields.')
          } else {
            try {
                e.preventDefault()
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    password,
                    passwordCheck,
                    supervisor
                }
    
                const registerRes = await UserService.registerUser(newUser)
                if (registerRes) {
                    history.push('/login')
                }                
            } catch (err) {
                toast.error(err.response.data)
            }
          }
    }

    return (
        <div className="registration-form-container">
            <div className="registration-form">
                <div className="registration-form-header-container">
                    <h1 className="registration-form-header-text">Registration Form</h1> 
                </div>
                <Form noValidate validated={validated} onSubmit={submit}>
                    <Row>
                        <Col>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control required placeholder="First Name" id="formFirstName" onChange={(e) => setFirstName(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control required placeholder="Last Name" id="formLastName" onChange={(e) => setLastName(e.target.value)} />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control required type="email" placeholder="Enter email" id="formEmail" onChange={(e) => setEmail(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" id="formPassword" onChange={(e) => setPassword(e.target.value)} />
                        </Col>
                        <Col>
                            <Form.Label>Verify Password</Form.Label>
                            <Form.Control required type="password" placeholder="Verify Password" id="formPasswordVerify" onChange={(e) => setPasswordCheck(e.target.value)} />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Form.Label>Select Your Supervisor</Form.Label>
                            <Form.Control required as="select" id="formSelectSupervisor" onChange={(e) => setSupervisor(e.target.value)}>
                                <option>{null}</option>
                                { supervisorsList }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className="mt-2 justify-content-md-center">
                        <Button style="btn--create--solid" size="btn--small" radius={2} icon="address-card" type="submit">Submit</Button>
                    </Row>
                </Form>
                <div className="login-assistance-container">
                    <Link className="login-assistance-item" to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register