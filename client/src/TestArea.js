import React from 'react'

import DataTable from './components/Common/DataTable'

const fakeData = [
    { id: 1, test: "true" },
    { id: 2, test: "false" }
]

const TestArea = () => {
    return (
        <div className="app-spacing-utility">
            <DataTable data={fakeData} handleDelete={() => {}}/>
        </div>
    )
}

export default TestArea