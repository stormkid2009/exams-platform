import React from "react";
import 'tailwindcss/tailwind.css'


function UiHeader() {
  return (
    <div className="text-center p-4 m-2 ">
      <h1 className="text-2xl p-2">welcome to exams platform</h1>
      <p className="text-lg p-2">please write valid session id down below</p>
    </div>
  );
}

export default UiHeader;
