import React from 'react'
import Header from "./header"
import Info from "./info"

/**
 * Intro Component
 * 
 * This component serves as the introductory section of the application. 
 * It includes the header and informational text about the application's features.
 * 
 * The component renders:
 * - Header: Displays the title and welcome message.
 * - Info: Provides an overview of the services offered by the application.
 */
function Intro() {
  return (
    <div className="text-center ">
      <Header />
      <Info />
    </div>
  )
}

export default Intro

