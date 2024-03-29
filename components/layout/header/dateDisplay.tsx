import {useState,useEffect} from 'react'



function DateDisplay() {
    const [dateState,setDateState] = useState(new Date());
  
  useEffect(()=>{
    setInterval(()=>{
      setDateState(new Date());
    },30000)
  },[])
  return (
    <div className=' border rounded-md p-1'>
        <p>{dateState.toLocaleDateString('en-GB',{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
    </div>
  )
}

export default DateDisplay