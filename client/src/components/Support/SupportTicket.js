import React, { useState, useContext } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { Prompt } from 'react-router-dom'
import Button from '../Common/Button'
import { useUserState } from '../../context'

const SupportTicket = ({ submitTicket }) => {
    const userData = useUserState()
    const [supportForm, setSupportForm] = useState({ subject: undefined, body: undefined })
    const [isDirty, setIsDirty] = useState(false)
    
    const handleFormChanges = (e) => {
        setIsDirty(true)
        switch (e.target.id) {
            case 'subject':
                setSupportForm({...supportForm, subject: String(e.target.value) })
                break
            case 'body':
                setSupportForm({...supportForm, body: String(e.target.value) })
                break
            default:
                setSupportForm({...supportForm })
                break
        }
    }

    const isValid = supportForm.subject && supportForm.body

    const bodyPlaceholder = "Please provide as much detail as possible so that we may better assist you..."
    
    return (
        <div className="support-form-container">
            <Form>
                <Prompt
                    when={isDirty}
                    message={() => 'Leaving will clear the form, are you sure?'}
                />
                <Form.Group>
                    <Row className="mt-1 md-1">
                    <Col>
                        <Form.Label>Subject</Form.Label>
                            <Form.Control 
                                type="textarea" 
                                id={'subject'}
                                onChange={handleFormChanges}/>
                    </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" id={'body'} onChange={handleFormChanges} placeholder={bodyPlaceholder} rows={6} />
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button style={isValid? "btn--create--solid" : "btn--delete--solid"} size="btn--small" disabled={!isValid} onClick={() => submitTicket(userData.user.id, supportForm)} type="button">
                            {!isValid? 'Incomplete Form' : 'Submit Ticket'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default SupportTicket