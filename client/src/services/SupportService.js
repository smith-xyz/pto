import BaseService from './BaseService.js'

export default {
    async submitSupportTicket(userId, data) {
        try {
            const res = await BaseService.post(`support/new-ticket/${userId}`, data)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    }
}