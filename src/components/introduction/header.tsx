import React from 'react'

/**
 * Header Component
 * 
 * This component renders the header section of the application, 
 * which includes a welcoming message for users.
 * 
 * The header displays the title "Welcome to Your Questions Storage" 
 * in a prominent font style and size.
 */
function Header() {
  return (
    <div className='font-mono text-2xl p-2'>
        <h1>Welcome to Your Questions Storage</h1>
    </div>
  )
}

export default Header