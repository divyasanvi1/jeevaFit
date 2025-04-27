import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

function Auth() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

export default Auth