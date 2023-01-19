// container of the question

import Header from "./header"
import Content from "./content"
import Answers from "./answers"
import NextBtn from "../buttons/nextBtn"
import PreviousBtn from "../buttons/previousBtn"
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