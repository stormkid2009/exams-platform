import { memo } from "react";

interface PlatformTitleProps {
  className?: string;
}

const PlatformTitle = memo(function PlatformTitle({ className = "" }: PlatformTitleProps) {
  return (
    <div className={`py-4 ${className}`}>
      <h2 className="text-3xl font-bold text-center">Online Tests Generator</h2>
    </div>
  );
});

export default PlatformTitle;
