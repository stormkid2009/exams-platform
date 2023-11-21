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
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const newValue = e.target.value;
        const error = validate(name, newValue);
        setError(error);
        if(!error) {
            onChange(name, newValue);
        }


    }

    return (
        <div>
            <label>
                <span>{name}</span>
                <input 
                    type='text'
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className='m-2 p-2'
                />
            </label>
            {error && <div className='text-red'><span>{error}</span></div>}
        </div>
    );
}


export default InputField;