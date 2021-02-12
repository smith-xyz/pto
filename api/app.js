const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/user-routes')
const requestsRouter = require('./routes/requests-routes.js')
const supervisorRouter = require('./routes/supervisor-routes')
const adminRouter = require('./routes/admin-routes')
const calendarRouter = require('./routes/calendar-routes')
const supportRouter = require('./routes/support-routes')

const app = express()

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

app.use(express.json())

//Routes
app.use('/api/user', userRouter)
app.use('/api/request', requestsRouter)
app.use('/api/supervisor', supervisorRouter)
app.use('/api/admin', adminRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/support', supportRouter)

// Implement 500 error route
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something is broken.')
})
// Implement 404 error route
app.use((req, res, next) => {
    res.status(404).send('Sorry we could not find that.')
})

module.exports = app