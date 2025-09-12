import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notification } from 'antd'
import { register, login, reset, getProfile } from '../auth/authSlice'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/authform.scss'

const AuthForms = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isSuccess, isError, message, user } = useSelector((state) => state.auth)

  const [activeForm, setActiveForm] = useState('login')
  const [avatarFile, setAvatarFile] = useState(null)

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    age: ''
  })

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const onChangeRegister = (e) => {
    const { name, value } = e.target
    setRegisterData(prev => ({ ...prev, [name]: value }))
  }

  const onChangeAvatar = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const onChangeLogin = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmitRegister = async (e) => {
    e.preventDefault()
    const { name, email, password, password2, age } = registerData

    if (password !== password2) {
      return notification.error({ message: 'Error', description: 'Passwords do not match' })
    }

    if (!name || !email || !password || !age) {
      return notification.error({ message: 'Error', description: 'Please fill in all fields' })
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('age', age.toString()) 
      if (avatarFile) formData.append('avatar', avatarFile)

      await dispatch(register(formData)).unwrap()
      await dispatch(getProfile())
    } catch (err) {
      console.error(err)
    }
  }

  const onSubmitLogin = async (e) => {
    e.preventDefault()
    const { email, password } = loginData

    if (!email || !password) {
      return notification.error({ message: 'Error', description: 'Please fill in all fields' })
    }

    try {
      await dispatch(login({ email, password })).unwrap()
      await dispatch(getProfile())
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isSuccess && user) {
      notification.success({ message: 'Success', description: message || 'Welcome!' })
      navigate('/')
      dispatch(reset())
    }

    if (isError) {
      notification.error({ message: 'Error', description: message || 'Something went wrong' })
      dispatch(reset())
    }
  }, [isSuccess, isError, message, user, navigate, dispatch])

  return (
    <div className={`wrapper ${activeForm === 'register' ? 'active' : ''}`}>
      <div className="form-wrapper sign-in">
        <form onSubmit={onSubmitLogin}>
          <h2>Login</h2>
          <div className="input-group">
            <input type="email" name="email" value={loginData.email} onChange={onChangeLogin} required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" value={loginData.password} onChange={onChangeLogin} required />
            <label>Password</label>
          </div>
          <button type="submit">Login</button>
          <div className="signUp-link">
            <br></br>
            <p>Don't have an account? <a href="#!" onClick={() => setActiveForm('register')}>Sign Up</a></p>
          </div>
        </form>
      </div>

      <div className="form-wrapper sign-up">
        <form onSubmit={onSubmitRegister}>
          <h2>Sign Up</h2>
          <div className="input-group">
            <input type="text" name="name" value={registerData.name} onChange={onChangeRegister} required />
            <label>Name</label>
          </div>
          <div className="input-group">
            <input type="email" name="email" value={registerData.email} onChange={onChangeRegister} required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" value={registerData.password} onChange={onChangeRegister} required />
            <label>Password</label>
          </div>
          <div className="input-group">
            <input type="password" name="password2" value={registerData.password2} onChange={onChangeRegister} required />
            <label>Confirm Password</label>
          </div>
          <div className="input-group">
            <input type="number" name="age" value={registerData.age} onChange={onChangeRegister} required />
            <label>Age</label>
          </div>
          <div className="input-group">
            <input type="file" name="avatar" accept="image/*" onChange={onChangeAvatar} />
            <label>Avatar (optional)</label>
          </div>
          <button type="submit">Sign Up</button>
          <div className="signUp-link">
                        <br></br>
            <p>Already have an account? <a href="#!" onClick={() => setActiveForm('login')}>Sign In</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthForms
