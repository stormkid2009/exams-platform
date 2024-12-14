import React from 'react'
import GrammaireForm from 'components/inputForm/grammaireForm';
import fetcher from 'src/lib/helpers/fetcher';

// Type for form data
type GrammaireFormData = {
  content: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  rightAnswer: number;
};

export default function DashBoard() {
  const path = `/api/questions/category/grammaire`;

  const handleSubmit = async(data: GrammaireFormData) => {
    try {
      const response = await fetcher(data, path);
      // Handle success (you might want to show a success message or redirect)
      console.log('Question created successfully:', response);
    } catch (error) {
      // Handle error (you might want to show an error message)
      console.error('Error creating question:', error);
    }
  };

  return (
    <div>
      <GrammaireForm handleSubmit={handleSubmit}/>
    </div>
  );
}