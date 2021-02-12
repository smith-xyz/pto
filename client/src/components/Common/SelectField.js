import React from 'react'
import { Col, Form } from 'react-bootstrap'

export const SelectField = ({ options, size, onChange }) => (
    <React.Fragment>
        {options && Array.isArray(options) &&
            <Form.Group as={Col} xs lg="4" controlId="formFilterOptions">
                <Form.Control as="select" defaultValue={options[0]} size={size? size : 'sm'} onChange={(e) => onChange()} >
                    {options.map((option, index) => { return <option key={index} value={option}>{option}</option>})}
                </Form.Control>
            </Form.Group>
        }
    </React.Fragment>
)
