import React, { useState } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { Prompt } from 'react-router-dom'
import RequestsService from '../../services/RequestsService'
import dateFormatter from '../../utility/date-formatter'
import Button from '../Common/Button'

//toDo Just make this reusable for creating new and editing the form
const EditRequestForm = ({ index, request, handleClose }) => {
    const [updatedRequest, setUpdatedRequest] = useState({
        id: request['id'],
        startDate: dateFormatter.getFormattedDate(request.startDate),
        endDate: dateFormatter.getFormattedDate(request.endDate),
        halfDay: request.halfDay!== 'N/A'? false : true,
        meridiem: request.halfDay !== 'N/A'? request.halfDay : '',
        notes: request.notes
    })

    const [isDirty, setIsDirty] = useState(false)

    const handleChange = (e) => {
        setIsDirty(true)
        switch (e.target.id) {
            case index + '-startDate':
                setUpdatedRequest({...updatedRequest, startDate: dateFormatter.setFormattedDate(e.target.value) })
                break
            case index + '-endDate':
                setUpdatedRequest({...updatedRequest, endDate: dateFormatter.setFormattedDate(e.target.value) })
                break
            case index + '-halfDay':
                setUpdatedRequest({...updatedRequest, halfDay: e.target.value === 'Yes'? true : false})
                break
            case index + '-meridiem':
                setUpdatedRequest({...updatedRequest, meridiem: e.target.value !== ''? e.target.value : ''})
                break
            case index + '-notes':
                setUpdatedRequest({...updatedRequest, notes: e.target.value })
                break
            default:
                setUpdatedRequest({...updatedRequest })
                break
        }
    }

    const handleUpdateRequest = (updatedRequest, handleClose) => {
        RequestsService.updateRequest({
            id: updatedRequest.id,
            startDate: updatedRequest.startDate,
            endDate: updatedRequest.endDate,
            halfDay: updatedRequest.halfDay,
            meridiem: updatedRequest.meridiem,
            notes: updatedRequest.notes
        }).then(res => {
                setIsDirty(false)
                handleClose()
                window.location = window.location
            }).catch(err => {
                err.response.data && setError(err.response.data)
            })
    }

    return (
        <div className="app-spacing-utility-3">
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
                            defaultValue={dateFormatter.getFormattedDate(request.startDate)} 
                            id={index +'-startDate'}
                            onChange={handleChange}/>
                </Col>
                <Col xs lg="3" md="auto">
                    <Form.Label>Return Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            defaultValue={dateFormatter.getFormattedDate(request.endDate)} 
                            id={index +'-endDate'}
                            data-testid="endDateField"
                            onChange={handleChange}/>
                </Col>
                <Col md="auto">
                <Form.Label>Half day?</Form.Label>
                    <Form.Control as="select" defaultValue={request.halfDay !== 'N/A' ? 'Yes' : 'No'} id={index +'-halfDay'} onChange={handleChange}>
                        <option>Yes</option>
                        <option>No</option>
                    </Form.Control>
                </Col>
                <Col md="auto">
                <Form.Label>AM/PM?</Form.Label>
                    <Form.Control as="select" defaultValue={request.halfDay !== 'N/A'? request.halfDay : ''} id={index +'-meridiem'} onChange={handleChange}>
                        <option></option>
                        <option>AM</option>
                        <option>PM</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-2">
                <Col md={{ span: 8, offset: 0 }}>
                   <Form.Label>Additional Notes</Form.Label>
                    <Form.Control as="textarea" id={index + '-notes'} defaultValue={request.notes && request.notes} onChange={handleChange} />
                </Col>
            </Row>
            </Form.Group>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Button style="btn--create--solid" 
                                size="btn--small"
                                radius={2}
                                onClick={() => { handleUpdateRequest(updatedRequest, handleClose) }}
                                icon="check-double">Submit Changes</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default EditRequestForm