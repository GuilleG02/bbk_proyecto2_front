import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi'
import { logout, reset } from '../auth/authSlice'
import '../assets/styles/theheader.scss'

const TheHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await dispatch(logout())
    dispatch(reset())
    navigate('/auth') // aquí va la ruta pública correcta
  }

  return (
    <header className="the-header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src="/snapglow2.png" alt="logo" />
      </div>
      <nav className="nav-icons">
        <button onClick={() => navigate('/')} title="Home" aria-label="Home">
          <FiHome />
        </button>
        <button onClick={() => navigate('/profile')} title="Perfil" aria-label="Perfil">
          <FiUser />
        </button>
        <button onClick={handleLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
          <FiLogOut />
        </button>
      </nav>
    </header>
  )
}

export default TheHeader
