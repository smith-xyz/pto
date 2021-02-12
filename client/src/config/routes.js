import Login from '../components/Authentication/Login'
import ResetPassword from '../components/Authentication/ResetPassword'
import Register from '../components/Authentication/Register'
import Dashboard from "../components/Dashboard/Index"
import TimeOff from '../components/TimeOff/TimeOff'
import Approval from '../components/Approval/Approval'
import Calendar from '../components/Calendar/Calendar'
import PageNotFound from '../components/Common/PageNotFound.js'

export const routes = [
    {
        path: '/login',
        component: Login,
        isPrivate: false,
    },
    {
        path: '/reset/:token',
        component: ResetPassword,
        isPrivate: false
    },
    {
        path: '/register',
        component: Register,
        isPrivate: false,
    },
    {
        path: '/dashboard',
        component: Dashboard,
        isPrivate: true,
    },
    {
        path: '/timeoff',
        component: TimeOff,
        isPrivate: true,
    },
    {
        path: '/approval',
        component: Approval,
        isPrivate: true,
    },
    {
        path: '/calendar',
        component: Calendar,
        isPrivate: true,
    },
    {
        path: '/*',
        component: PageNotFound,
        isPrivate: true,
    },
]