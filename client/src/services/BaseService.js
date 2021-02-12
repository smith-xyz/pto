import axios from 'axios'
import Cookies from 'js-cookie'

const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    credentials: "include"
})

client.interceptors.request.use(
    config => {
      const token = Cookies.get('.PTO')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error)
)
  

export default {
    async get(path) {
        try {
            const res = await client.get(`api/${path}`)
            return Promise.resolve(res)
        }
        catch (e) {
            return Promise.reject(e)
        }
    },
    async post(path, body) {
        try {
            const res = await client.post(`api/${path}`, body)
            return Promise.resolve(res)
        }
        catch (e) {
            return Promise.reject(e)
        }
    },
    async put(path, body) {
        try {
            const res = await client.put(`api/${path}`, body)
            return Promise.resolve(res)
        }
        catch (e) {
            return Promise.reject(e)
        }
    },
    async delete(path) {
        try {
            const res = await client.delete(`api/${path}`)
            return Promise.resolve(res)
        }
        catch (e) {
            return Promise.reject(e)
        }
    }
}