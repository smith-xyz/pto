import React from 'react'
import { useUserState } from '../../context'

const Dashboard = () => {
    const userData = useUserState()

    return(
        <div className="homeContainer" style={{ padding: '2rem', margin: '0.5rem', alignItems: 'center' }}>
            <h1 style={{ display: 'center', alignItems: 'center', justifyContent: 'center' }}>
                {`Hello ${userData.user.firstName} ${userData.user.lastName}!`}
            </h1>
        </div>
    )
}

export default Dashboard