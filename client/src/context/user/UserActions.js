import UserService from '../../services/UserService'
import Cookies from 'js-cookie'

export const loginUser = async (dispatch, email, password) => new Promise(async (resolve, reject) => {  
    try {
        dispatch({ type: 'LOGIN_REQUEST' })
        const loginRes = await UserService.loginUser({ email, password })
        dispatch({ type: 'LOGIN_SUCCESS', user: loginRes.data.user, token: loginRes.data.token })
        Cookies.set('.PTO', loginRes.data.token, { expires: process.env.COOKIE_EXPIRE, secure: process.env.SECURE_COOKIE })
        resolve()
    } catch(err) {
        dispatch({ type: 'LOGIN_FAILURE', user: '', token: '' })
        reject(err.response.data)
    }
})
  
export const logout = (dispatch) => {
    dispatch({ type: 'LOGOUT' })
    Cookies.remove('.PTO')
}

export const checkLoggedInUser = async (dispatch) => new Promise(async (resolve, reject) => {
    try {
        dispatch({ type: 'VALIDATE_USER' })
        const res = await UserService.validUserToken()
        dispatch({ type: 'VALIDATED_USER', user: res.data.user, validated: true }) 
        resolve()
    } catch (err) {
        dispatch({ type: 'VALIDATED_USER', user: '', validated: false }) 
        reject('')
    }
})

export const forgotPassword = async (dispatch, email) => new Promise(async (resolve, reject) => {
    try {
        await UserService.forgotPassword({ email })
        resolve()
    } catch {
        reject()
    }
})

export const resetPassword = async (dispatch, password, token) => new Promise(async (resolve, reject) => {
    try {
        await UserService.resetPassword({ password, token })
        resolve()
    } catch (err) {
        reject(err.response.data)
    }
})