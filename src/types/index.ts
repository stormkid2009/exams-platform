export interface IUserModel {
    email: string;
    password: string;
    createdAt: Date;
  }

type QuestionType = "document" | "situations" | "grammaire" ;


//create interface for the question in general
// we omit the property of kind from the Question interface try to manipulate this with all components deals with it
// to correct to errors that will appear
export interface Question {
    content: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    rightAnswer: number;
}


export interface SubQuestion extends Question {
    opt5: string;
    rightAnswer2: number;
}
// create interface for the question in document
export interface DocQuestion extends  Question{
    kind:QuestionType;
    code:string;
}
// for the document question what we need to do
// first send the text to the api
// then send question by question to be saved in the questions array
// we need to figure out if the code have to be written manually or generated with a helper function
// or we need to get the id of the question object to use it for 
// searching in database to find the right target


// create interface for the text in document
export interface DocText {
    kind:QuestionType;
    text:string;
    code:string;
}
// create interface for the question of document
export interface DocumentQuestion  {
    kind:QuestionType;
    texte :string;
    questions:DocQuestion[];
    
}



// to override properties use Omit<InterfaceName,'propertyName'>
export interface SituationQuestion  extends SubQuestion {
    kind:QuestionType;
}




export interface GrammaireQuestion  extends Question {
    kind:QuestionType;
}

export interface Messages {
    success:string;
    failure:string;
    wrongMethod:string;
  }

