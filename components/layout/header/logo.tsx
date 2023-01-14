import "tailwindcss/tailwind.css";
import Image from 'next/image'

function Logo() {
  return (
    <div>
        <Image
          src="/examLogo.jpg"
          alt="exam-logo"
          width={50}
          height={50}
        ></Image>
    </div>
  )
}

export default Logo