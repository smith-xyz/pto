const router = require('express').Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth') 
const moment = require('moment')
let User = require('../models/user.model')
const emailFactory = require('../emails/email-factory')

const emailService = emailFactory()

router.get('/supervisors', async (req, res) => {
    try {
        const supervisors = await User.find({ isSupervisor: true, isAdmin: false })
        let formattedData = []
        supervisors.map((data) => {
            let formattedObject = {
                id: data._id,
                fullName: data.firstName + ' ' + data.lastName
            }
            formattedData.push(formattedObject)
        })
        return res.json(formattedData)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordCheck, supervisor } = req.body

        if (!firstName || !lastName || !email || !password || !passwordCheck || !supervisor)
            return res
                .status(400)
                .json('Required fields are empty!')
        
        if (password.length < 8 )
            return res
                .status(400)
                .json('Password is not required length.')

        if (password !== passwordCheck)
            return res
                .status(400)
                .json('Password verification failed, ensure they are the same.')
        
        const existingUser = await User.findOne({ email: email })
        if (existingUser)
            return res
                .status(400)
                .json('Account with email already exists.')
        
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            supervisorId: supervisor,
            isSupervisor: false,
            isAdmin: false
        })
        
        await newUser.save()

        await emailService.registerVerificationMsg(newUser)
        res.json('User Created!')
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password )
            return res
                .status(400)
                .json('Not all fields have been entered.')

        const user = await User.findOne({ email: email })
        if (!user) 
            return res
                .status(400)
                .json('Invalid login credentials.')
        
        const passwordVerification = await bcrypt.compare(password, user.password)

        if (!passwordVerification)
            return res
                .status(400)
                .json('Invalid login credentials.')

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                isSupervisor: user.isSupervisor,
                isAdmin: user.isAdmin
            }
        })
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.post('/password-reset', async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return

        //would like to have some kind of encryption here
        const hash = crypto.randomBytes(16).toString('hex')

        const user = await User.findOneAndUpdate({ email: email }, {
            password: null,
            resetPasswordToken: hash,
            resetPasswordRequestDate: moment().format()
        })

        if (user) {
            const emailRequest = await emailService.resetPasswordMsg(email, hash)
            if (emailRequest) return res.status(200).json("process complete")
        } else {
            return res.status(200).json("process complete")
        }
    } catch (err) {
        //always returning as 200 for security reasons
        return res.status(200).json("process complete")
    }
})

router.post('/update-password/:token', async (req, res) => {
    try {
        const match = await User.findOne({ resetPasswordToken: req.params.token })
        if (!match) return res.status(400).json('The one time link has expired.')
        
        const isValidToken = match.passwordTokenValid()

        if (isValidToken) {
                const { password } = req.body
                const salt = await bcrypt.genSalt()
                const passwordHash = await bcrypt.hash(password, salt)
                await User.findOneAndUpdate({ resetPasswordToken: req.params.token }, { password: passwordHash, resetPasswordToken: null, resetPasswordRequestDate: null })
                return res.json('Password Updated!')
        } else {
            await User.findOneAndUpdate({ resetPasswordToken: req.params.token }, { password: null, resetPasswordToken: null, resetPasswordRequestDate: null })
            return res
                    .status(400)
                    .json('The one time link has expired.')
        } 
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.get('/validateUser', async (req, res) => {
    try {
        if (req.headers.authorization == undefined) return res.json(false)
        const token = req.headers && req.headers.authorization.split(" ")[1]
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json({user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            isSupervisor: user.isSupervisor,
            isAdmin: user.isAdmin
        }})
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        
        return res.json(user)
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            isSupervisor: user.isSupervisor,
            isAdmin: user.isAdmin
        })
    } catch (err) {
        res.status(500).json('Error: ' + err)
    }
})

module.exports = router