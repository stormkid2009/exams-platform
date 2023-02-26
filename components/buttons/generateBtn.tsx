//to generate session test

interface GenerateSessionProps {
  generate:()=>void;
}

function GenerateBtn({generate}:GenerateSessionProps) {
  return (
    <div className="bg-slate-900 text-white border rounded-md p-2 m-4  w-1/3 text-center">
      <button onClick={generate}>Generate Session</button>
    </div>
  );
}

export default GenerateBtn;
