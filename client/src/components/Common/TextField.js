import React from 'react'
import { Col, Form, FormControl } from 'react-bootstrap'
import { propTypes } from 'react-bootstrap/esm/Image'

export const TextField = ({type, placeholder, size, onChange, ...props }) => (
        <div className={props.className}>
            <FormControl type={type} placeholder={placeholder} size={size} className={`mr-${size}-auto`} onChange={(e) => onChange(e.target.value)} />
        </div>
)
