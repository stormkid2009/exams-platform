import React from 'react'
import SituationForm from "components/inputForm/siutationForm"
import { SubQuestion } from "src/types";
import fetcher from 'src/lib/helpers/fetcher';


export default function DashBoard (){
  const path = `/api/questions/category/situations` ;
  const handleSubmit = (data: SubQuestion) => {
    // call the fetcher function to send data to our api endpoint
    //console.log(`this is submitted: `,data);
    fetcher(data,path)
  };
    return(
        <div>
            <SituationForm  handleSubmit={handleSubmit}/>
        </div>
    )
}