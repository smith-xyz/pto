const router = require('express').Router()
const Request = require('../models/request.model')
const User = require('../models/user.model')
const auth = require('../middleware/auth') 
const moment = require('moment')
const emailFactory = require('../emails/email-factory')
const emailService = emailFactory()

router.get('/:userId', auth, async (req, res) => {
    try {
        const requests = await Request.find({ userId: req.params.userId }).exec()

        const formattedData = []
        
        requests.map((data) => {
            let formattedObject = {
                id: data._id,
                startDate: moment.utc(data.startDate, "YYYY-MM-DD").format("MM-DD-YYYY"),
                endDate: moment.utc(data.endDate, "YYYY-MM-DD").format("MM-DD-YYYY"),
                halfDay: data.halfDay ? data.meridiem : 'N/A',
                status: data.status,
                notes: data.notes
            }

            formattedData.push(formattedObject)
        })

        return res.json(formattedData)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/draft-request', auth, async (req, res) => {
    try {
        const newRequest = new Request({
            userId: req.body.userId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            halfDay: req.body.halfDay,
            meridiem: req.body.meridiem,
            status: 'Draft',
            notes: req.body.notes,
            dateOfResponse: null
        })

        await newRequest.save()
        
        return res.json('Request Created!')
    } catch (err) {
        return
    }
})

router.put('/submit-request/:id', auth, async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(req.params.id, {
            status: 'Submitted',
        })

        const user = await User.findById(updatedRequest.userId)
        const { email: supervisorEmail } = await User.findById( { _id: user.supervisorId })

        const emailRequest = await emailService.newRequestMsg(user, supervisorEmail, req.body)
        
        if (emailRequest) {
            await updatedRequest.save()
            return res.json('Request Created!')
        }
    }
    catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.delete('/delete-request/:id', auth, async (req, res) => {
    try {
        const response = await Request.findByIdAndDelete(req.params.id)
        
        if (response.status === 'Submitted' || response.status === 'Approved') {
            const user = await User.findById({ _id: response.userId })
            const { email: supervisorEmail } = await User.findById( { _id: user.supervisorId })
    
            const emailRequest = await emailService.deletedRequestMsg(user, supervisorEmail, response)
    
            if (emailRequest) return res.json('Request deleted.')
        } else {
            return res.json('Request Deleted')
        }
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.put('/update-request/:id', auth, async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            halfDay: req.body.halfDay,
            meridiem: req.body.meridiem,
            notes: req.body.notes,
            dateOfResponse: null
        })

        if (request.status === 'Denied') await Request.findByIdAndUpdate(req.params.id, { status: 'Submitted' })

        if (request.status === 'Submitted' || request.status === 'Approved') {
            const user = await User.findById({ _id: request.userId })
            const { email: supervisorEmail } = await User.findById( { _id: user.supervisorId })
    
            const emailRequest = await emailService.updatedRequestMsg(user, supervisorEmail, request)
    
            if (emailRequest) return res.json(request)
        } else {
            return res.json(request)
        }        
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.put('/send-reminder/:id', auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
        const user = await User.findById({ _id: request.userId })
        const { email: supervisorEmail } = await User.findById({ _id: user.supervisorId })
        
        const emailRequest = await emailService.reminderMsg(user, supervisorEmail, request)

        if (emailRequest) return res.json('Reminder sent!')
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.put('/bulk-submit-drafts/:id', auth, async (req, res) => {
    try {
        const reqs = await Request.find({ userId: req.params.id, status: 'Draft' })
        
        const user = await User.findById(req.params.id)
        const { email: supervisorEmail } = await User.findById( { _id: user.supervisorId })

        if (reqs.length > 0) {
            const emailRequest = await emailService.bulkSubmitRequestsMsg(user, supervisorEmail, reqs)
            const bulkSubmit = await Request.updateMany({ userId: req.params.id, status: 'Submitted' })
            if (emailRequest && bulkSubmit) return res.json('Drafts submitted.')
        }

    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.delete('/bulk-delete-drafts/:id', auth, async (req, res) => {
    try {
        const bulkDelete = await Request.deleteMany({ userId: req.params.id, status: 'Draft' })

        if (bulkDelete) return res.json('Drafts deleted.')
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

module.exports = router