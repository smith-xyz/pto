import React from 'react'
import { OverlayTrigger, Tooltip as BsToolTip } from 'react-bootstrap'

const ToolTip = (props) => (
        <OverlayTrigger
            placement={props.placement}
            delay={{ show: 0, hide: 0 }}
            overlay={<BsToolTip id="button-tooltip">{props.text? props.text: ""}</BsToolTip>} >
            <div>
                {props.children}
            </div>
        </OverlayTrigger>
)

export default ToolTip