import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AuthForms from './components/AuthForms'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import PostDetail from './components/PostDetail'
import SearchPage from './components/SearchPage'
import TheHeader from './components/TheHeader'
import PrivateRoute from './components/PrivateRoute'
import PostForm from './components/PostForm' // importamos PostForm

function AppContent() {
  const location = useLocation()
  const hideHeaderPaths = ['/auth']
  const showHeader = !hideHeaderPaths.includes(location.pathname)

  return (
    <>
      {showHeader && <TheHeader />}
      <main style={{ paddingTop: showHeader ? '100px' : '0' }}>
        <Routes>
          <Route path="/auth" element={<AuthForms />} />

          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/posts/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />

          {/* Rutas para crear y editar posts */}
          <Route path="/create-post" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          <Route path="/edit-post/:id" element={<PrivateRoute><PostForm /></PrivateRoute>} />

          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/search/:searchType/:searchText?" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
