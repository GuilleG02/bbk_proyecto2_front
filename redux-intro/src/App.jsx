import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthForms from './components/AuthForms'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
