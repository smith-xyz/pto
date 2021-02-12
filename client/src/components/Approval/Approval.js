import React, { useState, useEffect } from 'react'
import { useUserState } from '../../context'
import DataTable from '../Common/DataTable'
import SupervisorService from '../../services/SupervisorService'
import { toast } from 'react-toastify'
import Button from '../Common/Button'
import Divider from '../Common/Divider'

const Approval = () => {
    const userData = useUserState()
    const [requests, setRequests] = useState([])
    const [showPending, setShowPending] = useState(true)
    const [showApproved, setShowApproved] = useState(false)

    useEffect(() => {
        getRequests(userData.user.id)
    }, [])

    const getRequests = (supId) => {
        SupervisorService.getSubordinateRequests(supId)
            .then(res => {
                setRequests(res.data)
            }).catch(err => {
                err.response.data && setError(err.response.data)
            })
    }

    const handleApproval = (id) => {
        SupervisorService.approveRequest(id)
            .then(res => {
                setRequests(requests.filter(r => r.id !== id))
                toast.success('Request Approved!')
            }).catch(err => {
                toast.error('Error Approving Request')
            })
    }

    const handleReject = async (id) => {
        SupervisorService.rejectRequest(id)
            .then(res => {
                setRequests(requests.filter(r => r.id !== id))
                toast.success('Request Denied!')
            }).catch(err => {
                toast.error('Error Rejecting Request')
            })
    }

    const showPendingToggle = () => setShowPending(!showPending)
    const showApprovedToggle = () => setShowApproved(!showApproved)

    return (
        <div className="requests-container">
            <div className="requests-button-group">
                <Button style="btn--edit--solid" 
                    size="btn--small"
                    radius={2}
                    onClick={showPendingToggle}
                    icon={showPending? "minus" : "plus"}>{showPending? "Hide Pending" : "Show Pending"}</Button>
                <Button style="btn--edit--solid" 
                    size="btn--small"
                    radius={2}
                    onClick={showApprovedToggle}
                    icon={showApproved? "minus" : "plus"}>{showApproved? "Hide Approved" : "Show Approved"}</Button>      
            </div>
            <div className={showPending || showApproved? "tables-container" : ""}>
                <div className="nonapproved-requests-container">
                    <Divider showLines={showPending} title={"Pending Requests"} />
                    {showPending && <DataTable
                            className="table-spacing-utility-1"
                            headers={["Requestor", "Start Date", "End Date", "Half-Day", "Status"]}
                            data={requests.filter(f => f.status === 'Submitted')}
                            noDataMessage={"All caught up!"}
                            handleEdit={handleApproval}
                            handleDelete={handleReject}
                            defaultFilter={"Start Date"}
                            rowDataRemove={['notes']}
                            for={'approval'} />}
                </div>
                <div className="approved-requests-container">
                    <Divider showLines={showApproved} title={"Approved Requests"} />
                    {showApproved && <DataTable
                        className="table-spacing-utility-1" 
                        data={requests.filter(f => f.status === "Approved")} 
                        noDataMessage={"Employees are getting tired..."}
                        defaultFilter={"Start Date"}
                        handleDelete={handleReject}
                        rowDataRemove={['notes']}
                        for={'sup-approved'} />}
                </div>
            </div>
        </div>
    )
}

export default Approval