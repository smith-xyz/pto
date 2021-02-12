import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from './Button'

const PageNotFound = () => {
    const history = useHistory()

    const handleNavigate = () => {
        history.push('/dashboard')
    }

    return (
        <div className="page-not-found-container">
            <div className="animated-ellipsis">Whoops</div>
            <h3>You should shouldn't be here.</h3>
            <Button style="btn--edit--solid" size="btn--small" radius={4} onClick={handleNavigate}> Go Home</Button>
        </div>
    )
}

export default PageNotFound