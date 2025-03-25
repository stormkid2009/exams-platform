import { NextApiRequest,NextApiResponse } from "next";
import { GrammaireService } from "src/services/grammaire.service";
import { Messages } from "src/types/common";
const msg:Messages = {
  success:"some success words",
  failure: "some failure words",
  wrongMethod: "some wrong method words",
  invalidData:"data are not available"
}
const handler = async(
  req:NextApiRequest,
  res:NextApiResponse
):Promise<void> =>{
  const path = "api/exams/questions/grammaire";
  const method = req.method || "UNKNOWN";

  if(method !== "GET"){
    // do something
    // return state code number
  }
  const result = GrammaireService.getQuestion({method,path});
  if(!result){
    //show msg
    //return status code number
  }
}
