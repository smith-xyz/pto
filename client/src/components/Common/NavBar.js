import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Navbar, Nav, NavItem, NavLink, NavDropdown } from 'react-bootstrap'
import { useUserDispatch, logout, useUserState } from '../../context'
import Modal from './Modal'
import SupportTicket from '../Support/SupportTicket'
import SupportService from '../../services/SupportService'
import { toast } from 'react-toastify'

const NavBar = () => {
  const dispatch = useUserDispatch()
  const userData = useUserState()
  const history = useHistory()
  
  const [showSupportModal, setShowSupportModal] = useState(false)

  const handleLogout = async () => {
    logout(dispatch)
    history.push('/login')
  }

  const toggleSupportModal = () => {
    setShowSupportModal(!showSupportModal)
  }

  const handleSubmitSupportTicket = (userId, data) => {
    SupportService.submitSupportTicket(userId, data)
      .then(res => {
        setShowSupportModal(false)
        toast.success('Ticket Submitted!')
      }).catch(err => {
        toast.error('Whoops! Something went wrong, try again.')
    })
  }

  return (
    <div className="nav-bar-container">
      <Navbar bg="dark" variant="dark">
          <Navbar.Collapse id="responsive-navbar-nav">
            <Navbar.Brand>PTO</Navbar.Brand>
          { userData.user && <> <Nav className="mr-auto pl-4">
            <NavItem className="justify-content-center">
              <NavLink as={Link} to="/dashboard">Dashboard</NavLink>
            </NavItem>
            <NavItem className="pl-2">
              <NavLink as={Link} to="/timeoff">Time Off</NavLink>
            </NavItem>
            { userData.user.isSupervisor && <NavItem className="pl-2">
              <NavLink as={Link} to="/approval">Approve Requests</NavLink>
              </NavItem> }
              <NavItem className="pl-2">
                <NavLink as={Link} to="/calendar">Calendar</NavLink>
              </NavItem>
            { userData.user.isAdmin && <NavDropdown title="Admin" className="pl-2">
              <NavDropdown.Item as={Link} to='/user-management'>User Management</NavDropdown.Item>
            </NavDropdown> }
            </Nav> 
            <Nav className="ml-auto">
              <NavLink className="ml-auto" onClick={handleLogout}>Logout</NavLink>
              <NavLink onClick={toggleSupportModal}>Support</NavLink>
            </Nav>
          </> }
          { !userData.user && 
            <Nav className="ml-auto">
            {/* going to utilize this so that support tickets are only for users, maybe change in the future */}
            <NavLink href="mailto:shaun.smith@farragut.com?subject=New User in PTO">Contact Us</NavLink>
            </Nav>
          }
          </Navbar.Collapse>
      </Navbar>
      {showSupportModal && 
        <Modal show={showSupportModal} modalClosed={toggleSupportModal} customButton={true}>
          {<SupportTicket submitTicket={handleSubmitSupportTicket}/>}
        </Modal>}
    </div>
  )
}

export default NavBar