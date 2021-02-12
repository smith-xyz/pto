import React, { useState } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { Prompt } from 'react-router-dom'
import dateFormatter from '../../utility/date-formatter'
import Button from '../Common/Button'

const RequestForm = (props) => {
    const [request, setRequest] = useState({
        userId: props.userId,
        startDate: '',
        endDate: '',
        halfDay: false,
        meridiem: '',
        notes: ''
    })

    const [isDirty, setIsDirty] = useState(false)

    const handleChange = (e) => {
        setIsDirty(true)
        switch (e.target.id) {
            case 'startDate':
                setRequest({...request, startDate: dateFormatter.setFormattedDate(e.target.value)})
                break
            case 'endDate':
                setRequest({...request, endDate: dateFormatter.setFormattedDate(e.target.value) })
                break
            case 'halfDay':
                setRequest({...request, halfDay: e.target.value === 'Yes'? true : false})
                break
            case 'meridiem':
                setRequest({...request, meridiem: e.target.value !== 'N/A'? e.target.value : ''})
                break
            case 'notes':
                setRequest({...request, notes: e.target.value})
                break
            default:
                setRequest({...request })
                break
        }
    }

    const isValid = request.startDate.length != 0 && request.endDate.length != 0 && request.endDate >= request.startDate

    const additionalNotesPlaceholder = "Please provide additional information including a coverage plan and key contacts for projects you are working on..."

    return (
        <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }} >
            <Form>
                <Prompt
                    when={isDirty}
                    message={() => 'You have unsaved changes. Are you sure you want to leave?'}
                />
                <Form.Group>
            <Row className="justify-content-md-center">
                <Col xs lg="3" md="auto">
                    <Form.Label>Start Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            id={'startDate'}
                            onChange={handleChange}/>
                </Col>
                <Col xs lg="3" md="auto">
                    <Form.Label>Return Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            id={'endDate'}
                            data-testid="endDateField"
                            onChange={handleChange}/>
                </Col>
                <Col md="auto" xs lg="2">
                <Form.Label>Half day?</Form.Label>
                    <Form.Control as="select" defaultValue='No' id={'halfDay'} onChange={handleChange}>
                        <option>Yes</option>
                        <option>No</option>
                    </Form.Control>
                </Col>
                <Col md="auto" xs lg="2">
                <Form.Label>AM/PM?</Form.Label>
                    <Form.Control as="select" disabled={!request.halfDay} defaultValue={request.halfDay !== 'N/A'? request.halfDay : ''} id={'meridiem'} onChange={handleChange}>
                        <option>N/A</option>
                        <option>AM</option>
                        <option>PM</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-2">
                <Col md={{ span: 10, offset: 0 }}>
                   <Form.Label>Additional Notes</Form.Label>
                    <Form.Control as="textarea" id={'notes'} onChange={handleChange} placeholder={additionalNotesPlaceholder} />
                </Col>
            </Row>
            </Form.Group>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button 
                            style={isValid? "btn--create--solid" : "btn--delete--solid"} 
                            radius={2} 
                            size="btn--small" 
                            isabled={!isValid} 
                            icon={isValid? "smile-beam": "frown-open"} onClick={() => props.submitDraft(request)} type="button">
                            {!isValid? 'Incomplete Form' : 'Submit Draft'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default RequestForm