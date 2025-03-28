import { NextApiRequest,NextApiResponse } from "next";
import { CompositionService } from "src/services/composition.service";
import { Messages } from "src/types/common";


const msg:Messages = {
  success:"successfully retrieve random grammaire question  ",
  failure:"failed to retrieve random grammaire question",
  wrongMethod:"the method is not valid",
  invalidData:"the data is not valid",
} as const;

const handler=async(req:NextApiRequest,res:NextApiResponse):Promise<void> =>{
  const method = req.method || "UNKNOWN";
  if(method !== "GET"){
    return res.status(400).json(msg.wrongMethod)
  }
try {
 const result = await CompositionService.getRandomQuestion({});
    if(!result.success){
      console.log(msg.failure);
      return res.status(result.error?.code || 500).json({error:result.error});

    }
    res.status(200).json(result.data);
} catch (error) {
 console.error(error);
 res.status(500).json({error:msg.invalidData});
}
}

export default handler;
