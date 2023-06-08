import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import GlobalProvider from './contexts'
import { ToastContainer } from 'react-toastify'
import Home from './views/Home'
import Login from './views/Login'
import ProtectRoute from './components/Common/ProtectRoute'

function App() {
  return (
    <GlobalProvider>
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={
                <ProtectRoute>
                  <Home />
                </ProtectRoute>
              }/>
          </Routes>
      </Router>
      <ToastContainer/>
    </GlobalProvider>
  )
}

export default App
