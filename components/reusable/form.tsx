import React,{useState} from 'react';
import InputField from './inputField';
import { Question } from 'src/types';


  
interface FormProps {
 fields:string[];
 handler:(data:Question)=>void;
}

const Form:React.FC<FormProps>=({fields,handler})=>{
    const [values,setValues] = useState<{[key:string]:string}>({});

    const handleChange = (name:string,value:string) => {
        setValues(
            (prevState)=>({...prevState,[name]:value}),
        );
    };

    const validate = (name: string, value: string) => {
        if (value.trim() === '') {
          return `${name} is required`;
        };
        // Check if the field is 'rightAnswer' and if it's numerical
        if (name === 'rightAnswer') {
          if (isNaN(Number(value))) {
            return `${name} should be a number`;
          }
        }
        // Add more validation logic here based on the field name if needed
        if(name === 'content'){
            if(value.length< 20){
                return `${name} should be at least 20   characters`;
            }
        }
        return '';
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        const {content, opt1, opt2, opt3, opt4, rightAnswer } = values;
        handler({content, opt1, opt2, opt3, opt4, rightAnswer:Number(rightAnswer)});
      };
    return(
        <form onSubmit={handleSubmit} className='text-center m-2 p-2'>
            {fields.map(
                (field)=>(
                    <InputField 
                    key={field}
                    name={field}
                    value={values[field] || ""}
                    onChange={handleChange}
                    validate={validate}
                    />
                )
            )}
            <button type='submit'
             className='text-white m-2 p-2 bg-slate-700 w-1/3 border-2 '
             >Submit</button>
        </form>
    );
};

export default Form;

