import React from "react";
import PassageForm from "components/inputForm/passageForm";
import { PassageQuestion } from "src/types";
import fetcher from "src/helpers/fetcher";

export default function DashBoard() {
  const path = `/api/questions/category/passage`;

  const handleSubmit = async (data: PassageQuestion) => {
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
