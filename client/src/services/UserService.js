import BaseService from './BaseService.js'

export default {
    async registerUser(userData) {
        try {
            const res = await BaseService.post(`user/register`, userData)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async loginUser(userData) {
        try {
            const res = await BaseService.post(`user/login`, userData)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async validUserToken() {
        try {
            const res = await BaseService.get(`user/validateUser`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async getUser(header) {
        try {
            const res = await BaseService.get(`user/`, header)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async getSupervisors() {
        try {
            const res = await BaseService.get(`user/supervisors`)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async forgotPassword(userData) {
        try {
            const res = await BaseService.post(`user/password-reset`, userData)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    },
    async resetPassword(userData) {
        try {
            const res = await BaseService.post(`user/update-password/${userData.token}`, userData)
            return res.statusText === 'OK' ? res : Promise.reject()
        } catch (err) {
            return Promise.reject(err)
        }
    }
}