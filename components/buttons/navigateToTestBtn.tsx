//redirect to the specified test page

interface NavigateToTestProps {
  navigate:()=>void
}
function NavigateToTestBtn({navigate}:NavigateToTestProps) {
  return (
    <div className="bg-slate-900 text-white border rounded-md p-2 m-4  w-1/3 text-center">
        <button onClick={navigate}>
            Navigate To Test
        </button>
    </div>
  )
}

export default NavigateToTestBtn