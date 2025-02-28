import Image from "next/image";
import  React  from "react";

interface LogoProps {
  className?: string;
}

const Logo = React.memo(function Logo({ className = "" }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/platformLogo.jpg"
        alt="Platform Logo"
        width={30}
        height={30}
      />
    </div>
  );
});

export default Logo;
