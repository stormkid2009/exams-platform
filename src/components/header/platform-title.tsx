import { memo } from "react";

interface PlatformTitleProps {
  className?: string;
}

const PlatformTitle = memo(function PlatformTitle({ className = "" }: PlatformTitleProps) {
  return (
    <div className={`py-4 ${className}`}>
      <h2 className="text-lg font-bold text-center">Tests Generator</h2>
    </div>
  );
});

export default PlatformTitle;
