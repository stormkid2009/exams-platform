import React, { useState , useEffect} from "react";
import {DocumentQuestion,DocQuestion} from 'src/types'
import SubForm from "./subForm";


// declare Props interface to describe the function passed from the parent component
interface Props {
  handleSubmit: (data:DocumentQuestion)=>void;
}

const DocumentForm:React.FC<Props>=({handleSubmit})=> {


 
 // declare the form state 
const [formData,setFormData] = useState<DocumentQuestion>({
  kind:'document',
  texte:'',
  questions:[],
  
});

const [childData,setchildData] = useState<DocQuestion[]>([])

useEffect(() => {
  setFormData({
    ...formData,
    questions:childData
  })
  console.log(formData);
}, [childData]);


// handle the input event on change with function
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

// handle the submit event with function
const handler = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if(!formData){
    return;
  }
  handleSubmit(formData);
  setFormData({
    kind:'document',
    texte:'',
    questions:[],
    
  })
};

const appendChildData =(data:DocQuestion) => {
  setchildData([...childData, data])
  
}
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      <form  className="flex flex-col items-center"  id="form-submit"
      onSubmit={handler}>
         <div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          Texte
          <input
            type="text"
            id="question-content"
            name="texte"
            value={formData.texte}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <SubForm  appendChildData = {appendChildData}/>
      </div>
    </div>
        <div>
            <button >
            Submit the Document Question</button> 
        </div>
      </form>
    </div>
  );
}

export default DocumentForm;
