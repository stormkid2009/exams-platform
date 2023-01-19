// to start the session of test

interface StartTestProps {
  start:()=>void;
}

function StartBtn({start}:StartTestProps) {
  return (
    <div className="bg-slate-900 text-white border rounded-md p-2 w-1/3 text-center">
      <button onClick={start}>Start</button>
    </div>
  )
}

export default StartBtn