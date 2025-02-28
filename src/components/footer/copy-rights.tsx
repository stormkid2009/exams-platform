import React  from "react";

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
