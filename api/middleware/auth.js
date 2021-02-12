const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) return res.status(401).json('You are not authorized to perform this action.')
        
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        if (!verified) return res.status(401).json('You are not authorized to perform this action.')

        req.user = verified.id
        next()
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports = auth