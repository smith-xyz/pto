import BaseService from './BaseService.js'

export default {
    async getSubordinateRequests(supervisorId) {
        try {
            const res = await BaseService.get(`supervisor/${supervisorId}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async approveRequest(id) {
        try {
            const res = await BaseService.put(`supervisor/approve-request/${id}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async rejectRequest(id) {
        try {
            const res = await BaseService.put(`supervisor/deny-request/${id}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    }
}