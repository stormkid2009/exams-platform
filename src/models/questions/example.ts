import { ILeDocumentModel} from "../../types";


// an example of interface of documentQuestion.
const question:ILeDocumentModel = {
    kind: "document",
    header:'lis le document puis reponds aux questions: ',
    texte:'some bla bla to understand the paragraph !!',
    subQuestions:[
        {
            header:"some bla bla bla",
            options:[
                {
                    name:'a',
                    content:'some answer to bla bla!1',
                    isChecked:false
                },
                {
                    name:'b',
                    content:'some answer to bla bla!2',
                    isChecked:true
                },
                {
                    name:'c',
                    content:'some answer to bla bla!3',
                    isChecked:false
                },
                {
                    name:'d',
                    content:'some answer to bla bla!4',
                    isChecked:false
                }
            ],
            answerIndex: 0,
            points:2
        },{
            header:"some bla bla bla",
            options:[
                {
                    name:'a',
                    content:'some answer to bla bla!1',
                    isChecked:false
                },
                {
                    name:'b',
                    content:'some answer to bla bla!2',
                    isChecked:true
                },
                {
                    name:'c',
                    content:'some answer to bla bla!3',
                    isChecked:false
                },
                {
                    name:'d',
                    content:'some answer to bla bla!4',
                    isChecked:false
                }
            ],
            answerIndex: 0,
            points:2
        }
    ],
    
    
}

export default question;