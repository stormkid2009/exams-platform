import React from "react";

/**
 * PlatformTitle Component
 * 
 * This component renders the title of the platform, "Tests Generator". 
 * It accepts an optional `className` prop for custom styling.
 * 
 * The title is displayed as a bold, centered heading with padding.
 * 
 * The component is memoized to optimize performance by preventing unnecessary re-renders.
 */
interface PlatformTitleProps {
  className?: string;
}

const PlatformTitle = React.memo(function PlatformTitle({ className = "" }: PlatformTitleProps) {
  return (
    <div className={`py-4 ${className}`}>
      <h2 className="text-lg font-bold text-center">Tests Generator</h2>
    </div>
  );
});

export default PlatformTitle;
