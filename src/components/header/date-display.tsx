import React ,{ useState, useEffect } from "react";

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
