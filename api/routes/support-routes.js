const router = require('express').Router()
const User = require('../models/user.model')
const auth = require('../middleware/auth') 
const emailFactory = require('../emails/email-factory')

const emailService = emailFactory()

router.post('/new-ticket/:id', auth, async (req, res) => {
    try {
        //potentially should store these tickets as documents, maybe as an extra virtual schema to the users: TBD
        const user = await User.findById({ _id: req.params.id })
        
        const emailRequest = await emailService.supportTicketMsg(user, req.body)

        if (emailRequest) return res.json('Ticket Submitted!')     
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

module.exports = router