
import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import OptionInput from "./option-input";
import "@testing-library/jest-dom";

type FormData = {
  option: string;
};

// Simple test component that directly renders OptionInput with form context
function TestComponent({ 
  errorMessage,
}: {
  errorMessage?: string;
}) {
  const { register, formState: { errors } } = useForm<FormData>();
  
  return (
    <form>
      <OptionInput<FormData>
        register={register}
        name="option"
        label="Option"
        errorMessage={errorMessage}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("OptionInput", () => {
  it("renders input with correct label", () => {
    render(<TestComponent />);
    
    const input = screen.getByLabelText("Option");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders with correct type", () => {
    render(<TestComponent />);
    
    const input = screen.getByLabelText("Option");
    expect(input).toHaveAttribute("type", "text");
  });

  it("displays an error message when provided", () => {
    const errorMessage = "Option is required";
    
    render(<TestComponent errorMessage={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("passes register function with required option", () => {
    // Mock the register function
    const registerMock = jest.fn();
    
    // Render directly without the TestComponent wrapper
    render(
      <OptionInput<FormData>
        register={registerMock}
        name="option"
        label="Option"
      />
    );
    
    // Check if register was called with the correct name and required option
    expect(registerMock).toHaveBeenCalledWith("option", { required: true });
  });

  it("passes props to BaseInput correctly", () => {
    const registerMock = jest.fn();
    const { rerender } = render(
      <OptionInput<FormData>
        register={registerMock}
        name="option"
        label="Option Label"
        errorMessage="Error message"
      />
    );
    
    // Check if label is passed correctly
    expect(screen.getByLabelText("Option Label")).toBeInTheDocument();
    
    // Check if error message is displayed
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });
});