import React  from "react";
/**
 * CopyRights Component
 * 
 * This component displays the copyright information, including the current year 
 * and the author's name. It accepts an optional className prop for styling.
 * 
 * Props:
 * - className (string, optional): Additional CSS classes to apply to the component.
 */
interface CopyRightsProps {
  className?: string;
}

const CopyRights = React.memo(function CopyRights({ className = "" }: CopyRightsProps) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={`text-center ${className}`}>
      ©{currentYear} ANWAR AHMED
    </div>
  );
});

export default CopyRights;
