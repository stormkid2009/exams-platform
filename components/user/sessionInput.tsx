
import "tailwindcss/tailwind.css"

function SessionInput() {
  return (
    <div className='border-2 rounded-md text-center p-2 m-4'>
        <label htmlFor="session-input"className='px-2'>Session id </label>
        <input
            id="session-input"
            type="text"
            placeholder="Session id will be here"
            aria-label="session-input"
            aria-describedby="session-input-description"
            className="p-2" 
            />
    </div>
  )
}

export default SessionInput