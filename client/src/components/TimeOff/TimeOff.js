import React, { useState, useEffect } from 'react'
import { useUserState } from '../../context'
import Button from '../Common/Button'
import Spinner from '../Common/Spinner'
import RequestForm from './RequestForm'
import RequestsService from '../../services/RequestsService'
import DataTable from '../Common/DataTable'
import Divider from '../Common/Divider'
import { toast } from 'react-toastify'

const TimeOff = () => {
    const userData = useUserState()
    const [showForm, setShowForm] = useState(false)
    const [requests, setRequests] = useState([])
    const [showPending, setShowPending] = useState(true)
    const [showApproved, setShowApproved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        if (userData.user) getRequests(userData.user.id)
        setIsLoading(false)
    }, [])

    const getRequests = (userId) => {
        RequestsService.getUserRequests(userId)
            .then(res => {
                setRequests(res.data)
            }).catch(err => {
                toast.error('Error Loading Data')
            })
    }
    //maybe I should have the request return the list?
    const handleSubmitDraftRequest = (request) => {
        RequestsService.postDraftRequest(request)
            .then(res => {
                handleDisplayForm()
                getRequests(userData.user.id)
                toast.success('Draft Created!')
            })
            .catch(err => {
                toast.error('Error Submitting Draft')
            })
    }

    const handleDeleteRequests = (id) => {
        RequestsService.deleteRequest(id)
            .then(res => {
                toast.success('Request Deleted!')
                setRequests(requests.filter(r => r.id !== id))
            }).catch(err => {
                toast.error('Error Deleting Request')
            })
    }

    const handleSendReminder = (id) => {
        RequestsService.sendReminder(id)
            .then(res => {
                toast.success('Reminder Sent')
            }).catch(err => {
                toast.error('Error Sending Reminder')
            })
    }
    //same here
    const handleSubmitRequest = (request) => {
        RequestsService.submitRequests(request)
            .then(res => {
                getRequests(userData.user.id)
                toast.success('Submitted Request!')
            }).catch(err => {
                toast.error('Error Submitting Request')
            })
    }

    const submitDraftRequests = (userId) => {
        RequestsService.bulkSubmitDrafts(userId)
            .then(res => {
                toast.success('Drafts Submitted')
                getRequests(userData.user.id)
            }).catch(err => {
                toast.error('Error Submitted Drafts')
            })
    }

    const deleteDraftRequests = (userId) => {
        RequestsService.bulkDeleteDrafts(userId)
            .then(res => {
                toast.success('Drafts Deleted')
                setRequests(requests.filter(r => r.status !== 'Draft'))
            }).catch(err => {
                toast.error('Error Deleting Drafts')
            })
    }

    const handleDisplayForm = () => setShowForm(!showForm)
    const showPendingToggle = () => setShowPending(!showPending)
    const showApprovedToggle = () => setShowApproved(!showApproved)

    //toDo make this look way cooler in the future
    return (
        <div className="requests-container">
            {isLoading? <Spinner /> : <React.Fragment>
            <div className="requests-button-group">
                <Button style="btn--edit--solid" 
                            size="btn--small"
                            radius={2}
                            onClick={handleDisplayForm}
                            icon="hiking">New Request</Button>
                <Button style="btn--create--solid" 
                        size="btn--medium" 
                        size="btn--small"
                        icon="check"
                        onClick={() => submitDraftRequests(userData.user.id)}
                        radius={2}>Submit All Drafts</Button>
                <Button style="btn--delete--solid" 
                        size="btn--medium" 
                        size="btn--small"
                        icon="trash-alt"
                        onClick={() => deleteDraftRequests(userData.user.id)}
                        radius={2}>Delete All Drafts</Button>
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
            <div className="request-form-container">
                {showForm && <RequestForm userId={userData.user.id} hideForm={handleDisplayForm} submitDraft={handleSubmitDraftRequest}/>}
            </div>
                <div className={showPending || showApproved? "tables-container" : ""}>
                    <div className="nonapproved-requests-container">
                        <Divider showLines={showPending} title={"Pending Requests"} />
                        {showPending && <DataTable
                            className="table-spacing-utility-1"
                            headers={["Start Date", "End Date", "Half-Day", "Status"]}
                            data={requests.filter(f => f.status !== 'Approved')} 
                            noDataMessage={"Looks like you need some time off..."}
                            handleDelete={handleDeleteRequests}
                            handleSubmit={handleSubmitRequest}
                            handleNudge={handleSendReminder}
                            rowDataRemove={['notes']}
                            for={'pending'} />}
                    </div>
                    <div className="approved-requests-container">
                        <Divider showLines={showApproved} title={"Approved Requests"} />
                        {showApproved && <DataTable
                            className="table-spacing-utility-1"
                            data={requests.filter(f => f.status == 'Approved')} 
                            noDataMessage={"No upcoming PTO approved yet..."}
                            rowDataRemove={['notes']}
                            for={'approved'} />}
                    </div>
            </div>
            </React.Fragment>}
        </div>
    )
}

export default TimeOff