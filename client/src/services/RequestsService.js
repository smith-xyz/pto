import BaseService from './BaseService.js'

export default {
    async getCalendarRequests() {
        try {
            const res = await BaseService.get(`calendar/`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async getUserRequests(userId) {
        try {
            const res = await BaseService.get(`request/${userId}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async getRequestById(id) {
        try {
            const res = await BaseService.get(`request/single/${id}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async postDraftRequest(data) {
        try {
            const res = await BaseService.post(`request/draft-request`, data)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async submitRequests(id) {
        try {
            const res = await BaseService.put(`request/submit-request/${id}`, null)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async updateRequest(data) {
        try {
            const res = await BaseService.put(`request/update-request/${data.id}`, data)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async deleteRequest(id) {
        try {
            const res = await BaseService.delete(`request/delete-request/${id}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async sendReminder(id) {
        try {
            const res = await BaseService.put(`request/send-reminder/${id}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async bulkSubmitDrafts(userId) {
        try {
            const res = await BaseService.put(`request/bulk-submit-drafts/${userId}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async bulkDeleteDrafts(userId) {
        try {
            const res = await BaseService.delete(`request/bulk-delete-drafts/${userId}`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    }
}