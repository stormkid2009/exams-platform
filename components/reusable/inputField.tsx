import React,{useState} from 'react';

interface InputFieldProps {
    name:string;
    value:string;
    onChange:(name:string, value:string) => void;
    validate: (name: string, value: string) => string;
}

// create reusable input field component
const InputField: React.FC<InputFieldProps>=({name, value,onChange,validate})=>{
    const [error,setError] = useState('');
    const inputStyle =`w-5/6  border rounded-md`;


    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        onChange(name, e.target.value);
        setError('');  // Clear the error state when the value changes
    };

    //we gonna use handleBlur function to validate the errors
    // and this for the purposes of triggering the function outside the onChange event
    //and this  after the input loose its focus
    //so we can typing without annoying errors
    const handleBlur = () => {
        const errorMessage = validate(name, value);
        setError(errorMessage);
      };
    

    return (
        <div className='text-center m-2 border rounded-md'>
            <label className='w-full flex justify-between items-center'>
                <span className='m-2 p-2 w-1/6'>{name}</span>
                <input 
                    type='text'
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}  // Validate the input when it loses focus
                    className={name==='rightAnswer' ?`w-4/6  border rounded` :inputStyle}
                    required
                />
            </label>
            {error && <div className='text-red-700'><span>{error}</span></div>}
        </div>
    );
}


export default InputField;