import Cookies from 'js-cookie'

let token = Cookies.get('.PTO')? Cookies.get('.PTO') : ''

export const initialState = {
    token: '' || token,
    user: '',
    validated: false,
    isLoading: false
  }

export const userReducer = (initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST': {
          return {
            ...initialState, 
            isLoading: true
          }
        }
        case 'LOGIN_SUCCESS': {
          return {
            ...initialState,
            user: action.user,
            token: action.token,
            validated: true,
            isLoading: false
          }
        }
        case 'LOGIN_FAILURE': {
          return {
            ...initialState,
            isLoading: false
          }
        }
        case 'VALIDATE_USER': {
          return {
            ...initialState,
            validated: false,
            isLoading: true
          }
        }
        case 'VALIDATED_USER': {
          return {
            ...initialState,
            user: action.user,
            validated: action.validated,
            isLoading: false
          }
        }
        case 'LOGOUT': {
            return {
                ...initialState,
                user: "",
                token: ""
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}
