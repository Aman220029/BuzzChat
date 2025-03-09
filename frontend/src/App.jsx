import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './pages/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import {Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from 'react-hot-toast'
function App() {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  // console.log("onlineUser: ", onlineUsers);
  
  useEffect(() => {
    checkAuth();
  }, [])

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    )
  };

  return (
   <div data-theme={theme}>
     <Navbar />
     <Toaster />
     <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
      <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/"/>} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
     </Routes>
   </div>
  )
}

export default App
