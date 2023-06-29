export interface ISession {
    email: string;
    testIdex: number;
}

type QuestionType = "document" | "situations" | "grammaire" ;
interface Option {
    name:'a' | 'b' | 'c' | 'd' | 'e';
    content: string;
    isChecked: boolean;
}

interface ISubQuestion {
    header: string; // like >>>  ahmed ..... a l'ecole.
    options: Option[]; 
    answerIndex:number;// 0 here for the first element in the array of options
    points:number;  // for example 2 for the right answer
}

interface ISituationSub extends Omit <ISubQuestion,'answerIndex'>{
    answerIndex:number[];
}


interface IQuestion {
    kind:QuestionType;
    header:string;  // like  >>>  Lis ce document puis reponds aux questions suivantes?
    subQuestions:ISubQuestion[];
    
}


export interface ILeDocumentModel extends IQuestion {
    texte :string;
    
}



// to override properties use Omit<InterfaceName,'propertyName'>
export interface ISituationsModel extends Omit <IQuestion,'subQuestions'>{
    subQuestions:ISituationSub;
    
}




export interface IGrammaireModel extends IQuestion {}

// farah anwar is ali 