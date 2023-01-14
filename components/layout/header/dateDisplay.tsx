import {useState,useEffect} from 'react'
import "tailwindcss/tailwind.css";


function DateDisplay() {
    const [dateState,setDateState] = useState(new Date());
  
  useEffect(()=>{
    setInterval(()=>{
      setDateState(new Date());
    },30000)
  },[])
  return (
    <div>
        <p>{dateState.toLocaleDateString('en-GB',{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
    </div>
  )
}

export default DateDisplay