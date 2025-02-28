import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import BaseInput from "./base-input";
import "@testing-library/jest-dom";

type FormData = {
  test: string;
};

const TestForm = ({ children }: { children: React.ReactNode }) => {
  const { register } = useForm<FormData>();
  return <form>{children}</form>;
};

describe("BaseInput", () => {
  it("renders a text input by default", () => {
    render(
      <TestForm>
        <BaseInput<FormData>
          name="test"
          label="Test Input"
          register={jest.fn()}
        />
      </TestForm>
    );
    const input = screen.getByLabelText("Test Input");
    expect(input).toBeInTheDocument();
  });

  it("renders a textarea when type is textarea", () => {
    render(
      <TestForm>
        <BaseInput<FormData>
          name="test"
          label="Test Input"
          type="textarea"
          register={jest.fn()}
        />
      </TestForm>
    );
    const textarea = screen.getByLabelText("Test Input");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders a select element when type is select", () => {
    const options = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
    ];
    render(
      <TestForm>
        <BaseInput<FormData>
          name="test"
          label="Test Input"
          type="select"
          options={options}
          register={jest.fn()}
        />
      </TestForm>
    );
    const select = screen.getByLabelText("Test Input");
    expect(select.tagName).toBe("SELECT");
  });

  it("displays an error message when provided", () => {
    const errorMessage = "This field is required";
    render(
      <TestForm>
        <BaseInput<FormData>
          name="test"
          label="Test Input"
          errorMessage={errorMessage}
          register={jest.fn()}
        />
      </TestForm>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("calls onChange handler when input value changes", async () => {
    const handleChange = jest.fn();
    render(
      <TestForm>
        <BaseInput<FormData>
          name="test"
          label="Test Input"
          onChange={handleChange}
          register={jest.fn()}
        />
      </TestForm>
    );
    const input = screen.getByLabelText("Test Input");
    await userEvent.type(input, "new value");
    expect(handleChange).toHaveBeenCalled();
  });
});