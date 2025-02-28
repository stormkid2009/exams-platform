import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import AnswerInput from "./answer-input";
import "@testing-library/jest-dom";

type FormData = {
  answer: string;
};

// Simple test component that directly renders AnswerInput with form context
function TestComponent({ 
  errorMessage,
  maxOptions,
  label,
  options,
  registerOptions
}: {
  errorMessage?: string;
  maxOptions: 4 | 5;
  label?: string;
  options?: { value: string; label: string }[];
  registerOptions?: any;
}) {
  const { register, formState: { errors } } = useForm<FormData>();
  
  return (
    <form>
      <AnswerInput<FormData>
        register={register}
        name="answer"
        errorMessage={errorMessage}
        maxOptions={maxOptions}
        label={label}
        options={options}
        registerOptions={registerOptions}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("AnswerInput", () => {
  it("renders with default options when no custom options provided", () => {
    render(<TestComponent maxOptions={4} />);
    
    const select = screen.getByLabelText("Answer");
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
    
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("A");
    expect(options[1]).toHaveTextContent("B");
    expect(options[2]).toHaveTextContent("C");
    expect(options[3]).toHaveTextContent("D");
  });

  it("renders with 5 options when maxOptions is 5", () => {
    render(<TestComponent maxOptions={5} />);
    
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(5);
    expect(options[4]).toHaveTextContent("E");
  });

  it("renders with custom options when provided", () => {
    const customOptions = [
      { value: "opt1", label: "Option 1" },
      { value: "opt2", label: "Option 2" },
      { value: "opt3", label: "Option 3" },
      { value: "opt4", label: "Option 4" },
    ];
    
    render(<TestComponent maxOptions={4} options={customOptions} />);
    
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("Option 1");
    expect(options[1]).toHaveTextContent("Option 2");
    expect(options[2]).toHaveTextContent("Option 3");
    expect(options[3]).toHaveTextContent("Option 4");
  });

  it("throws an error when maxOptions is not 4 or 5", () => {
    // Silence the error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(
        // @ts-ignore - Testing runtime validation
        <TestComponent maxOptions={6} />
      );
    }).toThrow("Invalid maxOptions value. Must be 4 or 5.");
    
    // Restore console.error
    console.error = originalError;
  });

  it("displays a custom label when provided", () => {
    render(<TestComponent maxOptions={4} label="Select your answer" />);
    
    const label = screen.getByText("Select your answer");
    expect(label).toBeInTheDocument();
  });

  it("displays an error message when provided", () => {
    const errorMessage = "Please select an answer";
    
    render(<TestComponent maxOptions={4} errorMessage={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("passes registerOptions to BaseInput", () => {
    // Mock the register function
    const registerMock = jest.fn();
    const registerOptions = { required: "This field is required" };
    
    // Render directly without the TestComponent wrapper
    render(
      <AnswerInput<FormData>
        register={registerMock}
        name="answer"
        maxOptions={4}
        registerOptions={registerOptions}
      />
    );
    
    // Check if register was called with the correct name and options
    expect(registerMock).toHaveBeenCalledWith("answer", registerOptions);
  });
});