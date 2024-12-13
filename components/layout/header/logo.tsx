//display the logo of our platform


import Image from 'next/image'

function Logo() {
  return (
    <div className=' '>
        <Image
          src="/platformLogo.jpg"
          alt="Platform Logo" 
          width={30}
          height={30}
        />

    </div>
  )
}

export default Logo