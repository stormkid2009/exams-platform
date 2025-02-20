import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm, FieldValues } from "react-hook-form";
import BaseInput from "src/components/inputs/base-input";
import "@testing-library/jest-dom";

describe("BaseInput", () => {
  const TestForm = ({ children }: { children: React.ReactNode }) => {
    const { register } = useForm<FieldValues>();
    return (
      <form>
        {React.cloneElement(children as React.ReactElement, { register })}
      </form>
    );
  };

  it("renders a text input by default", () => {
    render(
      <TestForm>
        <BaseInput name="test" label="Test Input" register={jest.fn()} />
      </TestForm>
    );

    const input = screen.getByLabelText("Test Input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders a textarea when type is textarea", () => {
    render(
      <TestForm>
        <BaseInput
          name="test"
          label="Test Input"
          type="textarea"
          register={jest.fn()}
        />
      </TestForm>
    );

    const textarea = screen.getByLabelText("Test Input") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders a select element when type is select", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];

    render(
      <TestForm>
        <BaseInput
          name="test"
          label="Test Input"
          type="select"
          options={options}
          register={jest.fn()}
        />
      </TestForm>
    );

    const select = screen.getByLabelText("Test Input") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("displays an error message when provided", () => {
    const errorMessage = "This field is required";

    render(
      <TestForm>
        <BaseInput
          name="test"
          label="Test Input"
          errorMessage={errorMessage}
          register={jest.fn()}
        />
      </TestForm>
    );

    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("text-red-500");
  });

  it("applies registerOptions to the input", () => {
    const registerOptions = { required: true };

    render(
      <TestForm>
        <BaseInput
          name="test"
          label="Test Input"
          registerOptions={registerOptions}
          register={jest.fn()}
        />
      </TestForm>
    );

    const input = screen.getByLabelText("Test Input") as HTMLInputElement;
    expect(input).toHaveAttribute("required");
  });

  it("calls onChange handler when input value changes", () => {
    const handleChange = jest.fn();

    render(
      <TestForm>
        <BaseInput
          name="test"
          label="Test Input"
          onChange={handleChange}
          register={jest.fn()}
        />
      </TestForm>
    );

    const input = screen.getByLabelText("Test Input") as HTMLInputElement;
    input.value = "new value";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handleChange).toHaveBeenCalled();
  });
});
