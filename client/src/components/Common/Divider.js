import React from 'react'

const Divider = (props) => {
    return (
        <div className="divider-container">
            <p className="divider-title-text">{props.showLines && props.title}</p>
            {props.showLines && <hr className="divider-line"></hr>}
        </div>
    )
}

export default Divider