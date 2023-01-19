//display the logo of our platform


import Image from 'next/image'

function Logo() {
  return (
    <div className=' '>
        <Image
          src="/examLogo.jpg"
          alt="exam-logo"
          width={30}
          height={30}
        />
    </div>
  )
}

export default Logo