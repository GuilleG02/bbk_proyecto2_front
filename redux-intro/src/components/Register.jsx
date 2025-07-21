import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notification } from 'antd'
import { register } from '../auth/authSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    age: ''
  })

  const { name, email, password, password2, age } = formData
  const dispatch = useDispatch()

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) {
      return notification.error({ message: 'Error', description: 'Passwords do not match' })
    }

    if (!name || !email || !password || !age) {
      return notification.error({ message: 'Error', description: 'Please fill in all fields' })
    }

    // Preparamos los datos que enviamos al backend (sin password2)
    const userData = {
      name,
      email,
      password,
      age: Number(age)
    }

    notification.success({ message: 'Success', description: 'User registered!' })
    dispatch(register(userData))
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={onChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Password"
      />
      <input
        type="password"
        name="password2"
        value={password2}
        onChange={onChange}
        placeholder="Confirm Password"
      />
      <input
        type="number"
        name="age"
        value={age}
        onChange={onChange}
        placeholder="Age"
      />
      <button type="submit">Register</button>
    </form>
  )
}

export default Register
