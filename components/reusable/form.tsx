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
        }
        // Add more validation logic here based on the field name if needed
        return '';
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        const {content, opt1, opt2, opt3, opt4, rightAnswer } = values;
        handler({content, opt1, opt2, opt3, opt4, rightAnswer:Number(rightAnswer)});
      };
    return(
        <form onSubmit={handleSubmit}>
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
            <button type='submit'>Submit</button>
        </form>
    );
};

export default Form;

