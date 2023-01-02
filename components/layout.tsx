import React from 'react'
import "tailwindcss/tailwind.css"
import Navbar from './navbar'
import Footer from './footer'

type LayoutProps = {
  children: React.ReactNode;
}
function Layout({ children}:LayoutProps) {
  return (
    <div className='bg-sky-400 text-white w-screen h-screen  p-2 flex flex-col '>
    <Navbar />
    {children}
    <Footer />
    </div>
  )
}

export default Layout