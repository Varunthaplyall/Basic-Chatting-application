import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './pages/home/Home'

const App = () => {
  // const isAuthenticated = localStorage.getItem('token');
  return (
    <div>
      <Routes>

        <Route path='/register' element={<Register/> } />
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>

      </Routes>
    </div>
  )
}

export default App