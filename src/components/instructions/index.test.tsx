import React from "react";
import { render, screen } from "@testing-library/react";
import Instructions from "./index";
import "@testing-library/jest-dom";

describe("Instructions", () => {
  it("renders the instructions text", () => {
    render(<Instructions />);
    
    const firstInstruction = screen.getByText("You shall do something first");
    expect(firstInstruction).toBeInTheDocument();
    
    const secondInstruction = screen.getByText("When u are ready click the button below to start the test");
    expect(secondInstruction).toBeInTheDocument();
  });

  it("renders with the correct styling classes", () => {
    render(<Instructions />);
    
    const container = screen.getByText("You shall do something first").closest("div");
    expect(container).toHaveClass("text-center");
    expect(container).toHaveClass("font-mono");
    expect(container).toHaveClass("text-xl");
  });

  it("renders both paragraphs", () => {
    render(<Instructions />);
    
    const paragraphs = screen.getAllByText(/./i);
    // Filter to only get the paragraph elements
    const actualParagraphs = paragraphs.filter(element => element.tagName === "P");
    expect(actualParagraphs).toHaveLength(2);
  });

  it("has the correct structure with paragraphs inside a div", () => {
    const { container } = render(<Instructions />);
    
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    
    const paragraphs = div?.querySelectorAll("p");
    expect(paragraphs?.length).toBe(2);
  });
});