// import { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { login } from '../auth/authSlice'

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' })
//   const { email, password } = formData
//   const dispatch = useDispatch()

//   const onChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const onSubmit = (e) => {
//     e.preventDefault()
//     dispatch(login(formData))
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       <input type="email" name="email" value={email} onChange={onChange} />
//       <input type="password" name="password" value={password} onChange={onChange} />
//       <button type="submit">Login</button>
//     </form>
//   )
// }

// export default Login