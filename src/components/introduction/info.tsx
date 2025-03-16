import React from 'react'

/**
 * Info Component
 * 
 * This component displays informational text about the application's features. 
 * It provides users with a brief overview of the services offered, including:
 * - Storage space for all questions.
 * - Automatic session generation for tests.
 */
function Info() {
  return (
    <div className='text-xl p-2'>
        <p>We provide you Storage space for all questions</p>
        <p>And auto generate session for test</p>
    </div>
  )
}

export default Info