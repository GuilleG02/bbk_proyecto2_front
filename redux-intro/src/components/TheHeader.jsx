import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiHome, FiUser, FiLogOut, FiSearch } from 'react-icons/fi'
import { FaReact } from 'react-icons/fa'
import { logout, reset } from '../auth/authSlice'
import '../assets/styles/theheader.scss'

const TheHeader = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    await dispatch(logout())
    dispatch(reset())
    navigate('/auth')
  }

  return (
    <header className="the-header">
      <div className="logo" onClick={() => navigate('/')}>
        <FaReact size={50} color="##D1D1D1" />
      </div>
      <nav className="nav-icons">
        <button onClick={() => navigate('/')} title="Home" aria-label="Home">
          <FiHome />
        </button>
        <button onClick={() => navigate('/search')} title="Buscar" aria-label="Buscar">
          <FiSearch />
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
