// container of the question
//lets think about the question component 
// it will be used to display the question only
// or we can use it to input the question too
import Header from "./header"
import Content from "./content"
import Answers from "./answers"
//we will render one of the buttons or both conditionally
//the type of question determines this.

function Question() {
  return (
    <div>
      <Header />
      <Content />
      <Answers />
    </div>
  )
}

export default Question