const router = require('express').Router()
const auth = require('../middleware/auth') 
let User = require('../models/user.model')
let Request = require('../models/request.model')
const moment = require('moment')


router.get('/users/', auth, async (req, res) => {
    try {
        const users = await User.find()
        
        return res.json(users)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.get('/requests/', auth, async (req, res) => {
    try {
        const requests = await Request.find().exec()
        
        return res.json(requests)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/promote-supervisor/:id', auth, async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isSupervisor: true })

        res.json('User promoted!')
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/promote-admin/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isAdmin: true })

        res.json('User promoted!')
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.delete('/delete-user/:id', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

module.exports = router