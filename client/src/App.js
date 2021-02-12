import React, { useEffect } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import AppRoutes from './components/AppRoutes'
import { routes } from './config/routes'
import { UserProvider, useUserState, useUserDispatch, validateUser } from "./context";
import NavBar from './components/Common/NavBar'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFrownOpen, faSmileBeam, faListAlt, faEnvelope, faWindowClose } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer } from 'react-toastify'
import './custom.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

library.add(fas, faFrownOpen, faSmileBeam, faListAlt, faEnvelope, faWindowClose)

const App = () => {

  return (
    <div className="app-container">
      <BrowserRouter>
        <UserProvider>
        <NavBar />
        <ToastContainer />
          <Switch>
          {routes.map((route) => (
            <AppRoutes
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
            />
          ))}
          </Switch>
        </UserProvider>
      </BrowserRouter>
    </div>
  )
}

export default App