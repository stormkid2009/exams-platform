import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import OpenAnswerInput from "./open-answer-input";
import "@testing-library/jest-dom";

type FormData = {
  openAnswer: string;
};

// Simple test component that directly renders OpenAnswerInput with form context
function TestComponent({ 
  errorMessage,
}: {
  errorMessage?: string;
}) {
  const { register, formState: { errors } } = useForm<FormData>();
  
  return (
    <form>
      <OpenAnswerInput<FormData>
        register={register}
        name="openAnswer"
        errorMessage={errorMessage}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("OpenAnswerInput", () => {
  it("renders textarea with correct label", () => {
    render(<TestComponent />);
    
    const textarea = screen.getByLabelText("Open Answer");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders with 4 rows", () => {
    render(<TestComponent />);
    
    const textarea = screen.getByLabelText("Open Answer");
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("renders with placeholder text", () => {
    render(<TestComponent />);
    
    const textarea = screen.getByPlaceholderText("Enter your answer here");
    expect(textarea).toBeInTheDocument();
  });

  it("displays an error message when provided", () => {
    const errorMessage = "Answer is required";
    
    render(<TestComponent errorMessage={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("passes register function to BaseInput", () => {
    // Mock the register function
    const registerMock = jest.fn();
    
    // Render directly without the TestComponent wrapper
    render(
      <OpenAnswerInput<FormData>
        register={registerMock}
        name="openAnswer"
      />
    );
    
    // Check if register was called with the correct name
    // The second parameter is undefined because registerOptions isn't specified
    expect(registerMock).toHaveBeenCalledWith("openAnswer", undefined);
  });
});