const router = require('express').Router()
const Request = require('../models/request.model')
const User = require('../models/user.model')
const auth = require('../middleware/auth') 
const moment = require('moment')

router.get('/', auth, async (req, res) => {
    try {
        //let's do all the formatting here instead of on the client
        const users = await User.find().populate('requests').exec()

        let formattedData = []

        users.forEach((user) => {
            user.requests.filter(f => f.status == 'Approved').map((data) => {
                let formattedObject = {
                    startDate: moment(data.startDate).format("MM-DD-YYYY"),
                    endDate: moment(data.endDate).format("MM-DD-YYYY"),
                    title: user.firstName + ' ' + user.lastName,
                }

                formattedData.push(formattedObject)
            })
        })
        
        return res.json(formattedData)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    } 
})

module.exports = router