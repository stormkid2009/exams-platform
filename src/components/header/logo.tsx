import Image from "next/image";
import  React  from "react";
/**
 * Logo Component
 * 
 * This component renders the platform logo as an image. 
 * It accepts an optional `className` prop for custom styling.
 * 
 * The logo image is displayed with a fixed width and height of 30 pixels.
 * 
 * The component is memoized to optimize performance by preventing unnecessary re-renders.
 */

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
