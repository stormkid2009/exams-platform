import React from "react";
import Grammaire from "./grammaire";
import Composition from "./composition";
import Situation from "./situation";
import Passage from "./passage";

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