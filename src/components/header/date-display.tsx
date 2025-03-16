import React ,{ useState, useEffect } from "react";

/**
 * DateDisplay Component
 * 
 * This component displays the current date and updates it every 30 seconds.
 * It accepts an optional `className` prop for custom styling.
 * 
 * The date is displayed in the format: "Day Month Year" (e.g., "17 March 2025").
 * 
 * The component uses a `setInterval` to update the displayed date every 30 seconds.
 */
interface DateDisplayProps {
  className?: string;
}

function DateDisplay({ className = "" }: DateDisplayProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`border rounded-md p-1 text-center text-lg ${className}`} aria-label="Current date display">
      <p>
        {date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}

export default DateDisplay;
