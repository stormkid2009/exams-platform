import React from "react";
import PassageForm from "src/components/forms/question/passage-form";
import { type PassageFormData } from "src/shared/schemas/passage.schema";
import fetcher from "src/utils/fetcher";

export default function DashBoard() {
  const path = `/api/questions/category/passage`;

  const handleSubmit = async (data: PassageFormData) => {
    try {
      const response = await fetcher(data, path);
      console.log("Passage question created successfully:", response);
    } catch (error) {
      console.error("Error creating passage question:", error);
    }
  };

  return (
    <div>
      <PassageForm handleSubmit={handleSubmit} />
    </div>
  );
}
