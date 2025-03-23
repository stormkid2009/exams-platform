import React from "react";
import Grammaire from "./grammaire";
import Composition from "./composition";
import Situation from "./situation";
import Passage from "./passage";

// exam component which render one question from all types
export default function Exam(){
    return(
        <div>
            <h1>Exam</h1>
            <Passage />
            <Grammaire />
            <Situation />
            <Composition />
        </div>
    )

}
