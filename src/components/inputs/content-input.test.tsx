
import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import ContentInput from "./content-input";
import "@testing-library/jest-dom";

type FormData = {
  content: string;
};

// Simple test component that directly renders ContentInput with form context
function TestComponent({ 
  errorMessage,
  label = "Content",
  placeholder,
  rows
}: {
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
}) {
  const { register, formState: { errors } } = useForm<FormData>();
  
  return (
    <form>
      <ContentInput<FormData>
        register={register}
        name="content"
        label={label}
        placeholder={placeholder}
        errorMessage={errorMessage}
        rows={rows}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("ContentInput", () => {
  it("renders textarea with correct label", () => {
    render(<TestComponent label="Question Content" />);
    
    const textarea = screen.getByLabelText("Question Content");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders with default rows when not specified", () => {
    render(<TestComponent />);
    
    const textarea = screen.getByLabelText("Content");
    expect(textarea).toHaveAttribute("rows", "3");
  });

  it("renders with custom rows when specified", () => {
    render(<TestComponent rows={5} />);
    
    const textarea = screen.getByLabelText("Content");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("renders with placeholder when provided", () => {
    const placeholder = "Enter your content here...";
    render(<TestComponent placeholder={placeholder} />);
    
    const textarea = screen.getByPlaceholderText(placeholder);
    expect(textarea).toBeInTheDocument();
  });

  it("displays an error message when provided", () => {
    const errorMessage = "Content is required";
    
    render(<TestComponent errorMessage={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("passes register function to BaseInput with required validation", () => {
    // Mock the register function
    const registerMock = jest.fn();
    
    // Render directly without the TestComponent wrapper
    render(
      <ContentInput<FormData>
        register={registerMock}
        name="content"
        label="Content"
      />
    );
    
    // Check if register was called with the correct name and options
    expect(registerMock).toHaveBeenCalledWith("content", { required: true });
  });
});