
const mongoose = require('mongoose')

const Schema = mongoose.Schema
//might want to improve the status field to be some kind of lookup value
const requestSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    halfDay: { type: Boolean, required: true },
    meridiem: { type: String, required: false },
    status: { type: String, required: true },
    dateOfResponse: { type: Date },
    notes: { type: String, required: false }
})

const Request = mongoose.model('Request', requestSchema)

module.exports = Request