import React from 'react'
import Button from './Button'

const ErrorMessage = (props) => {
    return (
        <div className="error-notice">
            <span>{props.message}</span>
            <Button style="btn--delete--solid" size="btn--small" onClick={props.clearError}>X</Button>
        </div>
    )
}

export default ErrorMessage