const sgMail = require('@sendgrid/mail')
const moment = require('moment')

const sendMessage = async (msg) => {
    try {
        const res = await sgMail.send(msg)
        return res.find(f => f.statusCode == 202 )? res : Promise.reject()
    } catch (err) {
        return Promise.reject(err)
    }
}

const emailFactory = () => {

    let registerVerificationMsg = (user) => {

        const msg = {
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: `Registration Verification`,
            text: `Thank you for Registering! Please verify your account by clicking the link below:
                    \n ${process.env.ORIGIN}/${user.verificationToken}
                    \n 
                    \n Thank you,
                    \n PTO Support`
        }
        
        const sendRequest = sendMessage(msg)

        return sendRequest
    }

    let resetPasswordMsg = (email, token) => {

        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `PTO - Password Reset Requested`,
            text: `Please reset your password by clicking the link below (link will expire after 1 hour):
                    \n ${process.env.ORIGIN}/reset/${token}
                    \n 
                    \n Thank you,
                    \n PTO Support`
        }
        
        const sendRequest = sendMessage(msg)

        return sendRequest
    }

    let passwordResetConfirmation = (email) => {
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `PTO - Password Reset Success`,
            text: `Your password has been reset, if this action was not requested please contact support.
                    \n 
                    \n Thank you,
                    \n PTO Support`
        }
        
        const sendRequest = sendMessage(msg)

        return sendRequest
    }

    let newRequestMsg = (user, supervisorEmail, request) => {
        let halfDayText = getFormattedHalfDayText(request)

        const msg = {
            to: supervisorEmail,
            from: process.env.EMAIL_FROM,
            subject: `New PTO request from ${user.firstName} ${user.lastName}`,
            text: `${user.firstName} ${user.lastName} requests the following: 
                    \n Start Date is ${dateFormatter(request.startDate)}. 
                    \n Return Date is ${dateFormatter(request.endDate)}.
                    \n ${halfDayText}
                    \n Additional Details: ${request.notes? request.notes : "No additional notes provided."}
                    \n Please approve or deny this request by logging into PTO.`
        }
        
        const sendRequest = sendMessage(msg)
        return sendRequest
    }

    let deletedRequestMsg = (user, supervisorEmail, request) => {
        let halfDayText = getFormattedHalfDayText(request)

        const msg = {
            to: supervisorEmail,
            from: process.env.EMAIL_FROM,
            subject: `${user.firstName} ${user.lastName} deleted their PTO Request`,
            text: `${user.firstName} ${user.lastName} deleted the following request: 
                    \n Start Date: ${dateFormatter(request.startDate)}. 
                    \n Return Date: ${dateFormatter(request.endDate)}.
                    \n ${halfDayText}
                    \n No further action is needed.`
        }

        const sendRequest = sendMessage(msg)

        return sendRequest    
    }

    let updatedRequestMsg = (user, supervisorEmail, request) => {
        let halfDayText = getFormattedHalfDayText(request)

        const msg = {
            to: supervisorEmail,
            from: process.env.EMAIL_FROM,
            subject: `${user.firstName} ${user.lastName} updated their PTO Request`,
            text: `${user.firstName} ${user.lastName} updated a their request to the following: 
                    \n Start Date is ${dateFormatter(request.startDate)}. 
                    \n Return Date is ${dateFormatter(request.endDate)}.
                    \n ${halfDayText}
                    \n Additional Details: ${request.notes? request.notes : "No additional notes provided."}
                    \n Your approval has been reset, please login to approve/deny the request.`
        }

        const sendRequest = sendMessage(msg)

        return sendRequest     
    }

    let approvedRequestMsg = (userEmail, request) => {
        const msg = {
            to: userEmail,
            from: process.env.EMAIL_FROM,
            subject: `PTO Request Approved`,
            text: `Your request for ${dateFormatter(request.startDate)} through ${dateFormatter(request.endDate)} has been approved!
            \n You may delete or update the request by logging into the app. If not, enjoy the time off!`
        }

        const sendRequest = sendMessage(msg)

        return sendRequest    
    }

    let deniedRequestMsg = (userEmail, request) => {
        const msg = {
            to: userEmail,
            from: process.env.EMAIL_FROM,
            subject: `PTO Request Denied`,
            text: `Your request for ${dateFormatter(request.startDate)} through ${dateFormatter(request.endDate)} has been denied.
            \n You may delete or update the request by logging into the app.`
        }

        const sendRequest = sendMessage(msg)

        return sendRequest     
    }

    let reminderMsg = (user, supervisorEmail, request) => {
        let halfDayText = getFormattedHalfDayText(request)

        const msg = {
            to: supervisorEmail,
            from: process.env.EMAIL_FROM,
            subject: `Reminder: ${user.firstName} ${user.lastName} is awaiting your response for their PTO Request`,
            text: `${user.firstName} ${user.lastName} recently submitted the following request: 
                    \n Start Date is ${dateFormatter(request.startDate)}. 
                    \n Return Date is ${dateFormatter(request.endDate)}.
                    \n ${halfDayText}
                    \n Additional Details: ${request.notes? request.notes : "No additional notes provided."}
                    \n Please login and approve/deny the request.`
        }

        const sendRequest = sendMessage(msg)

        return sendRequest    
    }

    let bulkSubmitRequestsMsg = (user, supervisorEmail, requests) => {
        const msg = {
            to: supervisorEmail,
            from: process.env.EMAIL_FROM,
            subject: `New PTO requests submitted from ${user.firstName} ${user.lastName}`,
            text: `${user.firstName} ${user.lastName} requests the following:`
        }

        requests.forEach(request => {
            let halfDayText = getFormattedHalfDayText(request)

            let reqText = `\n Start Date is ${dateFormatter(request.startDate)}. 
                            \n Return Date is ${dateFormatter(request.endDate)}.
                            \n ${halfDayText}
                            \n Additional Details: ${request.notes? request.notes : "No additional notes provided."}
                            \n`
            
            msg.text = msg.text + reqText
        })

        msg.text = msg.text + `\n Please approve or deny this request by logging into PTO.`

        const sendRequest = sendMessage(msg)

        return sendRequest
    }

    let supportTicketMsg = (user, ticket) => {
        const msg = {
            to: process.env.SUPPORT_EMAIL,
            from: process.env.EMAIL_FROM,
            subject: `PTO Support: ${ticket.subject}`,
            text: `From: ${user.firstName} ${user.lastName} - ${user.email}
                    \n ${ticket.body}`
        }
        
        const sendRequest = sendMessage(msg)

        return sendRequest
    }

    const getFormattedHalfDayText = (request) => {
        let formattedText = ''

        if (request.halfDay) {
            formattedText = `Half Day: Yes - ${request.meridiem}.`
        } else {
            formattedText = 'Half Day: No.'
        }
        return formattedText
    }

    const dateFormatter = (date) => {
        return moment.utc(date, "YYYY-MM-DD").format("MM-DD-YYYY")
    }

    return {
        registerVerificationMsg: registerVerificationMsg,
        resetPasswordMsg: resetPasswordMsg,
        passwordResetConfirmation: passwordResetConfirmation,
        newRequestMsg: newRequestMsg,
        deletedRequestMsg: deletedRequestMsg,
        updatedRequestMsg: updatedRequestMsg,
        approvedRequestMsg: approvedRequestMsg,
        deniedRequestMsg: deniedRequestMsg,
        reminderMsg: reminderMsg,
        bulkSubmitRequestsMsg: bulkSubmitRequestsMsg,
        supportTicketMsg: supportTicketMsg
    }
}

module.exports = emailFactory;