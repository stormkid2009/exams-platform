import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  UseFormReturn,
  UseFieldArrayReturn,
  Control,
  UseFormRegister,
  Path,
  FormState,
  FieldValues,
  FieldArrayWithId
} from "react-hook-form";
import PassageForm from "./passage-form";
import { PassageFormData } from "src/shared/schemas/passage.schema";
import "@testing-library/jest-dom";

// Define related question type to match schema
type RelatedQuestion = {
  content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  rightAnswer: string;
};

// Define precise types for field array
type FieldArrayField = FieldArrayWithId<PassageFormData, "relatedQuestions", "id">;

interface MockFieldArrayReturn {
  fields: FieldArrayField[];
  append: jest.Mock;
  remove: jest.Mock;
  prepend?: jest.Mock;
  insert?: jest.Mock;
  swap?: jest.Mock;
  move?: jest.Mock;
  update?: jest.Mock;
  replace?: jest.Mock;
}

// Define a complete form state which satisfies FormState<PassageFormData>
const mockFormState = {
  errors: {},
  isDirty: false,
  dirtyFields: {},
  isSubmitted: false,
  touchedFields: {},
  isValid: true,
  isSubmitting: false,
  submitCount: 0,
  isLoading: false,
  isValidating: false,
  disabled: false,
  isSubmitSuccessful: false,
} as FormState<PassageFormData>;

interface MockFormReturn {
  register: jest.Mock;
  handleSubmit: jest.Mock;
  formState: FormState<PassageFormData>;
  control: Control<PassageFormData>;
  watch: jest.Mock;
  setValue: jest.Mock;
  getValues: jest.Mock;
  reset: jest.Mock;
  trigger?: jest.Mock;
  clearErrors?: jest.Mock;
  setError?: jest.Mock;
  setFocus?: jest.Mock;
  unregister?: jest.Mock;
}

// Our mock form data
const mockFormData: PassageFormData = {
  passage: "Test passage",
  relatedQuestions: [
    {
      content: "Test question",
      a: "Option A",
      b: "Option B",
      c: "Option C",
      d: "Option D",
      rightAnswer: "a",
    },
  ],
};

// Mocks for components
jest.mock("src/components/ui/toast", () => ({
  __esModule: true,
  default: ({
    type,
    message,
    onDismiss,
  }: {
    type: string;
    message: string;
    onDismiss: () => void;
  }) => (
    <div data-testid="toast" data-type={type} onClick={onDismiss}>
      {message}
    </div>
  ),
}));

jest.mock("src/components/inputs/content-input", () => ({
  __esModule: true,
  default: ({
    name,
    label,
    register,
    errorMessage,
  }: {
    name: Path<PassageFormData>;
    label: string;
    register: UseFormRegister<PassageFormData>;
    errorMessage?: string;
  }) => (
    <div data-testid={`content-input-${name}`}>
      <label>{label}</label>
      <textarea {...register(name)} data-testid={`textarea-${name}`} />
      {errorMessage && (
        <span data-testid={`error-${name}`}>{errorMessage}</span>
      )}
    </div>
  ),
}));

jest.mock("./related-question-form", () => ({
  __esModule: true,
  default: ({ index, onRemove }: { index: number; onRemove: () => void }) => (
    <div data-testid={`related-question-form-${index}`}>
      <input data-testid={`question-content-${index}`} />
      <input data-testid={`question-option-a-${index}`} />
      <input data-testid={`question-option-b-${index}`} />
      <input data-testid={`question-option-c-${index}`} />
      <input data-testid={`question-option-d-${index}`} />
      <select data-testid={`question-right-answer-${index}`}>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
      </select>
      <button data-testid={`remove-question-btn-${index}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

jest.mock("src/components/buttons/home", () => ({
  __esModule: true,
  default: () => <button data-testid="home-button">Home</button>,
}));

// Update the react-hook-form mocks with a full formState object
jest.mock("react-hook-form", () => {
  const originalModule = jest.requireActual("react-hook-form");
  return {
    ...originalModule,
    useForm: () => ({
      register: jest.fn().mockImplementation((name) => ({
        name,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      })),
      handleSubmit: jest
        .fn()
        .mockImplementation(
          (fn) =>
            (e:React.FormEvent<HTMLFormElement>) => {
              e?.preventDefault?.();
              return fn(mockFormData);
            }
        ),
      formState: mockFormState,
      control: {} as Control<PassageFormData>,
      watch: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn().mockReturnValue(mockFormData),
      reset: jest.fn(),
      trigger: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      setFocus: jest.fn(),
      unregister: jest.fn(),
    }),
    useFieldArray: () => ({
      fields: [
        { id: "1", content: "", a: "", b: "", c: "", d: "", rightAnswer: "a" },
        { id: "2", content: "", a: "", b: "", c: "", d: "", rightAnswer: "a" },
      ],
      append: jest.fn(),
      remove: jest.fn(),
      prepend: jest.fn(),
      insert: jest.fn(),
      swap: jest.fn(),
      move: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
    }),
    useFormContext: () => ({
      register: jest.fn().mockImplementation((name) => ({
        name,
        value: "",
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        disabled: false,
      })),
      control: {} as Control<PassageFormData>,
      formState: { errors: {} } as FormState<PassageFormData>,
      watch: jest.fn(),
      handleSubmit: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
      reset: jest.fn(),
      trigger: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      setFocus: jest.fn(),
      unregister: jest.fn(),
    }),
  };
});

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

// Tests
describe("PassageForm Component", () => {
  const mockHandleSubmit = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with initial question", () => {
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    expect(screen.getByTestId("content-input-passage")).toBeInTheDocument();
    expect(screen.getByTestId("related-question-form-0")).toBeInTheDocument();
    expect(screen.getByText("+ Add Question")).toBeInTheDocument();
    expect(screen.getByText("Create Question")).toBeInTheDocument();
  });

  it("adds a new question when add button is clicked", async () => {
    const mockAppend = jest.fn();
    jest.spyOn(require("react-hook-form"), "useFieldArray").mockImplementation(
      () => ({
        fields: [
          {
            id: "1",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
        ],
        append: mockAppend,
        remove: jest.fn(),
        prepend: jest.fn(),
        insert: jest.fn(),
        swap: jest.fn(),
        move: jest.fn(),
        update: jest.fn(),
        replace: jest.fn(),
      })
    );

    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const addButton = screen.getByText("+ Add Question");
    await user.click(addButton);

    expect(mockAppend).toHaveBeenCalledWith({
      content: "",
      a: "",
      b: "",
      c: "",
      d: "",
      rightAnswer: "a",
    });
  });

  it("does not remove the question if it is the only one", async () => {
    const mockRemove = jest.fn();
    jest.spyOn(require("react-hook-form"), "useFieldArray").mockImplementation(
      () => ({
        fields: [
          {
            id: "1",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
        ],
        append: jest.fn(),
        remove: mockRemove,
        prepend: jest.fn(),
        insert: jest.fn(),
        swap: jest.fn(),
        move: jest.fn(),
        update: jest.fn(),
        replace: jest.fn(),
      })
    );

    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const removeButton = screen.getByTestId("remove-question-btn-0");
    await user.click(removeButton);

    expect(mockRemove).not.toHaveBeenCalled();
  });

  it("removes a question when remove button is clicked", async () => {
    const mockRemove = jest.fn();
    jest.spyOn(require("react-hook-form"), "useFieldArray").mockImplementation(
      () => ({
        fields: [
          {
            id: "1",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
          {
            id: "2",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
        ],
        append: jest.fn(),
        remove: mockRemove,
        prepend: jest.fn(),
        insert: jest.fn(),
        swap: jest.fn(),
        move: jest.fn(),
        update: jest.fn(),
        replace: jest.fn(),
      })
    );

    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const removeButton = screen.getByTestId("remove-question-btn-1");
    await user.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it("removes a question when clicking on the sidebar button", async () => {
    const mockRemove = jest.fn();
    jest.spyOn(require("react-hook-form"), "useFieldArray").mockImplementation(
      () => ({
        fields: [
          {
            id: "1",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
          {
            id: "2",
            content: "",
            a: "",
            b: "",
            c: "",
            d: "",
            rightAnswer: "a",
          },
        ],
        append: jest.fn(),
        remove: mockRemove,
        prepend: jest.fn(),
        insert: jest.fn(),
        swap: jest.fn(),
        move: jest.fn(),
        update: jest.fn(),
        replace: jest.fn(),
      })
    );

    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const questionButton = screen.getByText("Question 2");
    await user.click(questionButton);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it("calls handleSubmit with form data when form is submitted", async () => {
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const submitButton = screen.getByText("Create Question");
    await user.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalledWith(mockFormData);
  });

  it("shows success toast when submission is successful", async () => {
    mockHandleSubmit.mockResolvedValueOnce({});
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const submitButton = screen.getByText("Create Question");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("toast")).toBeInTheDocument();
      expect(screen.getByTestId("toast")).toHaveAttribute(
        "data-type",
        "success"
      );
      expect(
        screen.getByText("Passage questions created successfully!")
      ).toBeInTheDocument();
    });
  });

  it("shows error toast when submission fails", async () => {
    mockHandleSubmit.mockRejectedValueOnce(new Error("Failed"));
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const submitButton = screen.getByText("Create Question");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("toast")).toBeInTheDocument();
      expect(screen.getByTestId("toast")).toHaveAttribute("data-type", "error");
      expect(
        screen.getByText(
          "Failed to create passage questions. Please try again."
        )
      ).toBeInTheDocument();
    });
  });

  it("dismisses toast when clicked", async () => {
    mockHandleSubmit.mockResolvedValueOnce({});
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const submitButton = screen.getByText("Create Question");
    await user.click(submitButton);

    const toast = await screen.findByTestId("toast");
    await user.click(toast);

    await waitFor(() => {
      expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
    });
  });

  it("resets the form after successful submission", async () => {
    const mockReset = jest.fn();
    jest.spyOn(require("react-hook-form"), "useForm").mockImplementation(
      () => ({
        register: jest
          .fn()
          .mockImplementation((name) => ({
            name,
            onChange: jest.fn(),
            onBlur: jest.fn(),
            ref: jest.fn(),
          })),
        handleSubmit: jest
          .fn()
          .mockImplementation(
            (fn) =>
              (e:React.FormEvent<HTMLFormElement>) => {
                e?.preventDefault?.();
                return fn(mockFormData);
              }
          ),
        formState: mockFormState,
        control: {} as Control<PassageFormData>,
        watch: jest.fn(),
        setValue: jest.fn(),
        getValues: jest.fn().mockReturnValue(mockFormData),
        reset: mockReset,
        trigger: jest.fn(),
        clearErrors: jest.fn(),
        setError: jest.fn(),
        setFocus: jest.fn(),
        unregister: jest.fn(),
      })
    );

    mockHandleSubmit.mockResolvedValueOnce({});
    render(<PassageForm handleSubmit={mockHandleSubmit} />);
    const submitButton = screen.getByText("Create Question");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
    });
  });
});