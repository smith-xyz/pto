import React, { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const buttonStyles = [
    "btn--primary--solid",
    "btn--secondary--solid",
    "btn--create--solid",
    "btn--edit--solid",
    "btn--delete--solid",
    "btn--nudge--solid",
    "btn--note--solid"
]

const buttonSizes = ["btn--medium", "btn--small"]

const Button = (props) => {
    const checkButtonStyle = buttonStyles.includes(props.style)? props.style : buttonStyles[0]
    const checkButtonSize = buttonSizes.includes(props.size)? props.size : buttonSizes[0]
    const icon = props.icon && <FontAwesomeIcon fixedWidth icon={props.icon} className="button-icon-spacing"/>

    return (
        <button 
            className={`btn-custom-${props.radius? props.radius : 1} ${checkButtonStyle} ${checkButtonSize}`}
            id={props.id}
            disabled={props.disabled}
            type={props.type? props.type : "button"}
            onClick={props.onClick}>
                <span>
                    {icon}
                    {props.children}
                </span>
        </button>
    )
}

export default Button