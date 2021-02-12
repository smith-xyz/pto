import React, { useState, useEffect, Fragment } from 'react'
import { Table } from 'react-bootstrap'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField } from './TextField'
import EditRequestForm from '../TimeOff/EditRequestForm'
import ToolTip from './Tooltip'
import Modal from './Modal'

export const DataOptions = {
    sortData: (col, option, data) => {
        let sortedData
        const objectKey = col && col.replace(/ /g, "").replace(/^[a-zA-Z]/g, c => c.toLowerCase()).replace(/\-/g, "")
        switch (option) {
            case 'desc':
                sortedData = data.sort((a,b) => {
                    return b[objectKey].toString().localeCompare(a[objectKey])
                })
            break
            case 'asc':
                sortedData = data.sort((a,b) => {
                    return a[objectKey].toString().localeCompare(b[objectKey])
                })            
            break
            default: 
                sortedData = data
        }

        return sortedData
    },
    filter: (searchStr, data) => {
        const regexp = new RegExp(new String(searchStr).replace(/\\/g, "\\\\"), 'i')
        
        return data.filter(f => Object.keys(f).some(l => regexp.test(f[l]) ))
    }
}

const DataTable = (props) => {
    const [data, setData] = useState([])
    const [sortColumn, setSortColumn] = useState(undefined)
    const [sortOption, setSortOption] = useState(undefined)
    const [showEditFormId, setShowEditFormId] = useState('')

    useEffect(() => {
        setData(props.data)
      },[props.data])

    const sortData = (column, option, data) => {
        if (column === sortColumn && option === sortOption) return
        setSortColumn(column)
        setSortOption(option)
        const sortedData = DataOptions.sortData(column, option, data)
        setData(sortedData)
    }
    
    const filterData = (text, data) => {
        if (text.length === 0) return setData(props.data)
        const filteredData = DataOptions.filter(text, data)
        if (filteredData.length > 0) return setData(filteredData)
        //toDo return something fancy for no data found :D
    }

    const handleShowEditForm = (id) => { 
        if (showEditFormId === id) {
            setShowEditFormId('')
        } else {
            setShowEditFormId(id)
        }
    }
    
    const [showNotesModalId, setShowNotesModalId] = useState('')

    const modalHandler = (e, id) => {
        e.preventDefault()
        if (showNotesModalId === id) {
            setShowNotesModalId('')
        } else {
            setShowNotesModalId(id)
        }
    }
    
    const tableColumnHeaders = props.headers && props.headers.map((header, index) => {
        return (<th key={index}>
                    <div style={{ display: "flex" }} onClick={() => sortData(header, sortOption !== 'asc'? 'asc' : 'desc', data)}>
                        {header}
                        {sortColumn == header? sortOption == 'asc'? 
                        <Fragment>
                            <FontAwesomeIcon 
                                icon="caret-up" 
                                style={{cursor: 'pointer'}} 
                                className="button-icon-spacing"
                                onClick={() => sortData(header, 'asc', data)} />
                            </Fragment>
                            : 
                            <Fragment>
                                <FontAwesomeIcon 
                                    icon="caret-down" 
                                    className="button-icon-spacing"
                                    style={{cursor: 'pointer'}} 
                                    onClick={() => sortData(header, 'desc', data)} />
                                </Fragment>
                        : null}
                    </div>
                </th>)
    })

    const tableDataRows = data.length > 0 && data.map((d, index) => {
        const { ["id"]: _, ...newData } = d
        
        props.rowDataRemove && props.rowDataRemove.forEach((o) => delete newData[o])

        return (
        <Fragment key={d.id}>
            <tr key={d.id}>
                {Object.values(newData).map((newData, index) => (
                    <td key={index}>{newData}</td>
                ))}
                {<td key={d.id}>
                    <div className="tooltip-container-1">
                        <ToolTip placement="top" text="View notes provided for this request.">
                            <Button style="btn--note--solid" size="btn--small" radius={1} id={d.id} icon="sticky-note" onClick={(e) => modalHandler(e, d.id)}></Button>
                            <Modal show={(d.id == showNotesModalId)} modalClosed={(e) => modalHandler(e, d.id)}>{d.notes}</Modal>
                        </ToolTip>
                    </div>
                </td>}
                    {props.for === 'pending' && (d.status == 'Draft' || d.status == 'Denied') &&
                        <td className="text-right">
                            <Button style="btn--edit--solid" size="btn--small" icon="list-alt" id={d.id} onClick={() => handleShowEditForm(d.id)}>Edit</Button>
                            <Button style="btn--create--solid" size="btn--small" icon="check" id={d.id} onClick={() => props.handleSubmit(d.id)}>Submit</Button>
                            <Button style="btn--delete--solid" size="btn--small" icon="trash-alt" id={d.id} onClick={() => props.handleDelete(d.id)}>Delete</Button>
                        </td>
                    }
                    {props.for === 'pending' && d.status == 'Submitted' &&
                        <td className="text-right">
                            <Button style="btn--edit--solid" size="btn--small" icon="list-alt" id={d.id} onClick={() => handleShowEditForm(d.id)}>Edit</Button>
                            <Button style="btn--nudge--solid" size="btn--small" icon="envelope" id={d.id} onClick={() => props.handleNudge(d.id)}>Nudge!</Button>
                            <Button style="btn--delete--solid" size="btn--small" icon="trash-alt" id={d.id} onClick={() => props.handleDelete(d.id)}>Delete</Button>
                        </td>
                    }
                    {props.for === 'approval' && 
                        <td className="text-right">
                            <Button style="btn--edit--solid" size="btn--small" id={d.id} onClick={() => props.handleEdit(d.id)}>Approve</Button>
                            <Button style="btn--delete--solid" size="btn--small" id={d.id} onClick={() => props.handleDelete(d.id)}>Reject</Button>
                        </td>
                    }
                    {props.for === 'approved' && 
                        <td className="text-right">
                            <Button style="btn--delete--solid" size="btn--small" icon="window-close" id={d.id} onClick={() => props.handleDelete(d.id)}>Cancel</Button>
                        </td>
                    }
                    {props.for === 'sup-approved' && 
                        <td className="text-right">
                            <Button style="btn--delete--solid" size="btn--small" id={d.id} onClick={() => props.handleDelete(d.id)}>Retract</Button>
                        </td>
                    }
            </tr>
            <tr style={{ display: showEditFormId === d.id? '' : 'none' }}>
                <td colSpan={6} style={{ overflow: "hidden" }}>
                    <EditRequestForm index={index} request={Object.assign(d, {})} handleClose={() => {setShowEditFormId('')}}/>
                </td>
            </tr>
        </Fragment>
        )
    })
//todo, separate filter to its own component
    return (
        <Fragment>
            <div className={props.className}>
                {
                    !data.length? props.noDataMessage : 
                    <Table responsive striped borderless hover variant="dark" size="sm">
                    <thead>
                        <tr>
                            {tableColumnHeaders}
                            {data.length > 0 && 
                                <td colSpan={(props.for == 'pending' || props.for == 'approval')? "2" : props.for !== 'sub-approved'? "7" : "6"}>
                                    <TextField 
                                        className={(props.for == 'pending' || props.for == 'approval')? "filter-container-1" : props.for !== 'sub-approved'? "filter-container-3" : "filter-container-2"}
                                        type="text" 
                                        placeholder="Search..." 
                                        size="sm"
                                        onChange={(e) => filterData(e, data) } />
                                </td>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && tableDataRows}
                    </tbody>
                </Table>
                }
            </div>
        </Fragment>
    )
}

export default DataTable