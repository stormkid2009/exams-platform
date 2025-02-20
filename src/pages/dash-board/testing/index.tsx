
import React from "react";
import TestForm,{type FormData} from "src/components/forms/testing/testForm";

export default function DashBoard() {

  const handleSubmit = async (data:FormData) => {
    try {
      console.log(data)
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <TestForm handleSubmit={handleSubmit} />
    </div>
  );
}
