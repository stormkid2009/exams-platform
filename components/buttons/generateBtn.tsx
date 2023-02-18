//to generate session test

interface GenerateTestProps {
  generate:()=>void;
}

function GenerateBtn({generate}:GenerateTestProps) {
  return (
    <div className="bg-slate-900 text-white border rounded-md p-2 m-4  w-1/3 text-center">
      <button onClick={generate}>Generate Test</button>
    </div>
  );
}

export default GenerateBtn;
