import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AuthForms from './components/AuthForms'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import TheHeader from './components/TheHeader'
import PrivateRoute from './components/PrivateRoute'

function AppContent() {
  const location = useLocation()
  const hideHeaderPaths = ['/auth'] // aquí ocultamos el header

  const showHeader = !hideHeaderPaths.includes(location.pathname)

  return (
    <>
      {showHeader && <TheHeader />}
      <main style={{ paddingTop: showHeader ? '100px' : '0' }}>
        <Routes>
          {/* Ruta pública para login/register */}
          <Route path="/auth" element={<AuthForms />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
