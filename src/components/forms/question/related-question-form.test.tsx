import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useFormContext, useForm } from "react-hook-form";
import RelatedQuestionForm from "./related-question-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Mock required form fields schema
const mockSchema = z.object({
relatedQuestions: z.array(
    z.object({
    content: z.string().min(1, "Content cannot be empty"),
    a: z.string().min(1, "Option A cannot be empty"),
    b: z.string().min(1, "Option B cannot be empty"),
    c: z.string().min(1, "Option C cannot be empty"),
    d: z.string().min(1, "Option D cannot be empty"),
    rightAnswer: z.enum(["a", "b", "c", "d"], {
        required_error: "Please select the right answer",
    }),
    })
),
});

type MockFormValues = z.infer<typeof mockSchema>;

// Wrapper component to provide form context
const FormWrapper = ({ children, formValues, errors = {} }) => {
const methods = useForm<MockFormValues>({
    resolver: zodResolver(mockSchema),
    defaultValues: formValues,
    mode: "onChange",
});

// Set errors using the setError method if provided
React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
        // Set errors using the proper react-hook-form API
        Object.entries(errors).forEach(([path, error]) => {
            if (Array.isArray(error)) {
                error.forEach((nestedError, index) => {
                    Object.entries(nestedError).forEach(([field, fieldError]) => {
                        methods.setError(`${path}.${index}.${field}` as any, fieldError as any);
                    });
                });
            }
        });
    }
}, [errors, methods]);

return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("RelatedQuestionForm", () => {
const defaultFormValues = {
    relatedQuestions: [
    {
        content: "Sample question content",
        a: "Option A",
        b: "Option B",
        c: "Option C",
        d: "Option D",
        rightAnswer: "a",
    },
    ],
};

it("renders all form fields correctly", () => {
    render(
    <FormWrapper formValues={defaultFormValues}>
        <RelatedQuestionForm index={0} onRemove={() => {}} />
    </FormWrapper>
    );

    // Check content field
    expect(screen.getByLabelText(/Question Text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question Text/i)).toHaveValue("Sample question content");

    // Use getByRole to specifically select textbox controls with their accessible names
    expect(screen.getByRole('textbox', { name: /A/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /A/i })).toHaveValue("Option A");

    expect(screen.getByRole('textbox', { name: /B/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /B/i })).toHaveValue("Option B");

    expect(screen.getByRole('textbox', { name: /C/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /C/i })).toHaveValue("Option C");

    expect(screen.getByRole('textbox', { name: /D/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /D/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /D/i })).toHaveValue("Option D");
    // Check right answer field
    // Use getByRole to specifically select the combobox for the answer field
    expect(screen.getByRole('combobox', { name: /Answer/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Answer/i })).toHaveValue("a");
});

it("calls onRemove function when remove button is clicked", () => {
    const mockOnRemove = jest.fn();
    
    render(
    <FormWrapper formValues={defaultFormValues}>
        <RelatedQuestionForm index={0} onRemove={mockOnRemove} />
    </FormWrapper>
    );

    // Find and click the remove button
    const removeButton = screen.getByRole("button", { name: /remove/i });
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    
    // Check if onRemove was called
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
});

it("displays validation errors for required fields", () => {
    // Setup form with validation errors
    // Setup form with validation errors
    const errors = {
        relatedQuestions: [
        {
            content: {
            type: "required",
            message: "Content cannot be empty",
            },
            a: {
            type: "required",
            message: "Option A cannot be empty",
            },
            rightAnswer: {
            type: "required",
            message: "Please select the right answer",
            },
        },
        ],
    };
    render(
    <FormWrapper formValues={defaultFormValues} errors={errors}>
        <RelatedQuestionForm index={0} onRemove={() => {}} />
    </FormWrapper>
    );

    // Check if error messages are displayed
    expect(screen.getByText("Content cannot be empty")).toBeInTheDocument();
    expect(screen.getByText("Option A cannot be empty")).toBeInTheDocument();
    expect(screen.getByText("Please select the right answer")).toBeInTheDocument();
});
});

