import React from "react";
import { NavigateBtn } from "src/components/buttons/navigate";

export const NewQuestionNav = () => (
  <div className="flex space-x-4">
    <NavigateBtn path="/dash-board/grammaire">
      Grammaire Form
    </NavigateBtn>
    <NavigateBtn path="/dash-board/situation">
      Situation Form
    </NavigateBtn>
    <NavigateBtn path="/dash-board/passage">
      Passage Form
    </NavigateBtn>
    <NavigateBtn path="/dash-board/composition">
      Composition Form
    </NavigateBtn>
  </div>
);