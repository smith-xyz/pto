const router = require('express').Router()
const User = require('../models/user.model')
const Request = require('../models/request.model')
const auth = require('../middleware/auth') 
const moment = require('moment')
const emailFactory = require('../emails/email-factory')

const emailService = emailFactory()

router.get('/:supervisorId', auth, async (req, res) => {
    try {
        const requests = await User.find({ supervisorId: req.params.supervisorId }).populate('requests').exec()

        const formattedData = []

        requests.forEach((user) => {
            user.requests.map((data) => {
                let formattedObject = {
                    id: data._id,
                    requestor: user.firstName + ' ' + user.lastName,
                    startDate: moment(data.startDate).format("MM-DD-YYYY"),
                    endDate: moment(data.endDate).format("MM-DD-YYYY"),
                    halfDay: data.halfDay ? data.meridiem : 'N/A',
                    status: data.status,
                    notes: data.notes
                }

                formattedData.push(formattedObject)
            })
        })

        return res.json(formattedData)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.put('/approve-request/:id', auth, async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Approved', dateOfResponse: moment().format() })

        const { email: email } = await User.findById({ _id: request.userId })
        
        const emailRequest = await emailService.approvedRequestMsg(email, request)
        
        if (emailRequest) return res.json('Request Approved!')        
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.put('/deny-request/:id', auth, async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, { status: 'Denied', dateOfResponse: moment().format() })

        const { email: email } = await User.findById({ _id: request.userId })
        
        const emailRequest = await emailService.approvedRequestMsg(email, request)
        
        if (emailRequest) return res.json('Request Denied!')        
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

module.exports = router