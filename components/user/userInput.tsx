
interface GetEmailProps {
  data: string;
  getEmail:(data:string) => void;
}

function UserInput({data,getEmail}:GetEmailProps) {
  
 
  return (
    <div className='border-2 rounded-md text-center p-2 m-2'>
        <label htmlFor="session-input"className='px-2'>Email </label>
        <input
            value={data}
            onChange={(e)=> getEmail(e.target.value)}
            id="session-input"
            type="text"
            placeholder="username@example.com"
            aria-label="session-input"
            aria-describedby="session-input-description"
            className="p-2 m-2" 
            />
    </div>
  )
}

export default UserInput