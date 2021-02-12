const mongoose = require('mongoose')
const app = require('./app')
const sgMail = require('@sendgrid/mail')

const PORT = process.env.PORT || 5000

const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useCreateIndex: true,
                        useFindAndModify: false,
                    })

const connection = mongoose.connection
connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
})

// toDo consider finding a means to handle crashed server :D
// app.on('uncaughtException')
// app.on('SIGTERM', )