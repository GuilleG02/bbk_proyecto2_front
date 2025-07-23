// import { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { notification } from 'antd'
// import { register } from '../auth/authSlice'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     age: ''
//   })

//   const { name, email, password, age } = formData
//   const dispatch = useDispatch()

//   const onChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const onSubmit = (e) => {
//     e.preventDefault()

//     if (!name || !email || !password || !age) {
//       return notification.error({ message: 'Error', description: 'Please fill in all fields' })
//     }

//     const userData = {
//       name,
//       email,
//       password,
//       age: Number(age)
//     }

//     notification.success({ message: 'Success', description: 'User registered!' })
//     dispatch(register(userData))
//   }

//   return (
//     <form onSubmit={onSubmit} className="form">
//       <h2>Register</h2>
//       <div className="input-group">
//         <input type="text" name="name" value={name} onChange={onChange} required />
//         <label>Name</label>
//       </div>
//       <div className="input-group">
//         <input type="email" name="email" value={email} onChange={onChange} required />
//         <label>Email</label>
//       </div>
//       <div className="input-group">
//         <input type="password" name="password" value={password} onChange={onChange} required />
//         <label>Password</label>
//       </div>
//       <div className="input-group">
//         <input type="number" name="age" value={age} onChange={onChange} required />
//         <label>Age</label>
//       </div>
//       <div className="remember">
//         <label><input type="checkbox" required /> I agree to the terms</label>
//       </div>
//       <button type="submit">Register</button>
//     </form>
//   )
// }

// export default Register
