import React, { Fragment } from 'react'
import Button from './Button'

const Backdrop = ({ show, clicked }) => (
    show ? <div className="custom-backdrop-modal" onClick={clicked}></div> : null
)

const Modal = ({ show, modalClosed, ...props }) => {

    return (
        <Fragment>
            <Backdrop show={show} clicked={modalClosed} />
            <div style={{color:'black'}}>
                {show && <div className="custom-modal" 
                    style={{ transform: show? 'translateY(0)' : 'translateY(-100vh)', opacity : show? 1 : 0 }}>
                        {props.children}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {!props.customButton && <Button radius={2} style="btn--delete--solid" size="btn--small" onClick={modalClosed}>Close</Button>}
                        </div>
                    </div>
                }
            </div>
        </Fragment>
    )
}

export default Modal