const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isSupervisor: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true },
    verificationToken: { type: String },
    verifiedDate: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordRequestDate: { type: Date }
}, { 
        toJSON: { virtuals: true }, 
        toObject: { virtuals: true },
        timestamps: true,
})

userSchema.methods.passwordTokenValid = function() {
    return (Date.now() - Date.parse(this.resetPasswordRequestDate)) < 3600000 // 1 hour in milliseconds
}

userSchema.virtual('requests', {
    ref: 'Request',
    localField: '_id',
    foreignField: 'userId'
})

const User = mongoose.model('User', userSchema)

module.exports = User