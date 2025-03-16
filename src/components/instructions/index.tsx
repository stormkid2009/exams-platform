// display the instructions which the user will follow
import React from "react"

/**
 * Instructions Component
 * 
 * This component displays instructions for the user regarding the test process. 
 * It provides guidance on what the user needs to do before starting the test.
 * 
 * The component includes:
 * - A message instructing the user to complete a task before starting the test.
 * - A prompt to click a button to begin the test when ready.
 */
function Instructions() {
  return (
    <div className="text-center font-mono text-xl">
      <p>You shall do something first </p>
      <p>When u are ready click the button below to start the test</p>


    </div>
  )
}

export default Instructions