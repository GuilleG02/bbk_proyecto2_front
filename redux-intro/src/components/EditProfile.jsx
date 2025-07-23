import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../auth/authSlice'
import '../assets/styles/profile.scss'

const EditProfile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    avatar: null
  })

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        avatar: null
      })
    }
  }, [user])

  const onChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'avatar') {
      setFormData({ ...formData, avatar: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const updatedData = new FormData()
    updatedData.append('name', formData.name)
    updatedData.append('email', formData.email)
    updatedData.append('age', formData.age)
    if (formData.avatar) {
      updatedData.append('avatar', formData.avatar)
    }

    // Aquí deberías despachar una acción como: dispatch(updateProfile(updatedData))
    console.log('[submit]', Object.fromEntries(updatedData))
    alert('Aquí iría la lógica para actualizar el perfil.')
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Editar Perfil</h2>
        <form onSubmit={onSubmit} className="edit-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
            <label>Nombre</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={onChange}
              required
            />
            <label>Edad</label>
          </div>

          <div className="input-group">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={onChange}
            />
          </div>

          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
