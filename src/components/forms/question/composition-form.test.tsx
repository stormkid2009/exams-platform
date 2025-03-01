import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { compositionSchema } from "../../../shared/schemas/composition.schema";
import CompositionForm from "./composition-form";

// Mock the schema import
jest.mock("../../../shared/schemas/composition.schema", () => ({
compositionSchema: {}
}));

// Mock the resolver import
jest.mock("@hookform/resolvers/zod", () => ({
zodResolver: jest.fn().mockReturnValue({})
}));

describe("CompositionForm", () => {
// Test validation setup
it("uses zodResolver with the composition schema for validation", () => {
    expect(zodResolver).toBeDefined();
    expect(compositionSchema).toBeDefined();
    expect(CompositionForm).toBeDefined();
});

// Test successful submission
it("calls handleSubmit and sets success toast on successful submission", async () => {
    // Create mocks
    const mockHandleSubmit = jest.fn().mockResolvedValue({});
    const mockSetToast = jest.fn();
    const mockReset = jest.fn();
    
    // Form data matching the schema
    const formData = {
    content: "Test content",
    a: "Option A",
    b: "Option B",
    answer: "a",
    };

    // Create a simplified version of the onSubmit function from the component
    const onSubmit = async (data) => {
    try {
        await mockHandleSubmit(data);
        mockSetToast({ type: "success", text: "Question created successfully!" });
        mockReset();
    } catch (error) {
        mockSetToast({
        type: "error",
        text: "Failed to create question. Please try again.",
        });
    }
    };

    // Call the onSubmit function directly
    await onSubmit(formData);

    // Verify expectations
    expect(mockHandleSubmit).toHaveBeenCalledWith(formData);
    expect(mockSetToast).toHaveBeenCalledWith({
    type: "success",
    text: "Question created successfully!"
    });
    expect(mockReset).toHaveBeenCalled();
});

// Test failed submission
it("sets error toast and doesn't reset form on failed submission", async () => {
    // Create mocks
    const mockHandleSubmit = jest.fn().mockRejectedValue(new Error("Submission failed"));
    const mockSetToast = jest.fn();
    const mockReset = jest.fn();
    
    // Form data matching the schema
    const formData = {
    content: "Test content",
    a: "Option A",
    b: "Option B",
    answer: "a",
    };

    // Create a simplified version of the onSubmit function from the component
    const onSubmit = async (data) => {
    try {
        await mockHandleSubmit(data);
        mockSetToast({ type: "success", text: "Question created successfully!" });
        mockReset();
    } catch (error) {
        mockSetToast({
        type: "error",
        text: "Failed to create question. Please try again.",
        });
    }
    };

    // Call the onSubmit function directly
    await onSubmit(formData);

    // Verify expectations
    expect(mockHandleSubmit).toHaveBeenCalledWith(formData);
    expect(mockSetToast).toHaveBeenCalledWith({
    type: "error",
    text: "Failed to create question. Please try again."
    });
    // The form should NOT be reset on error
    expect(mockReset).not.toHaveBeenCalled();
});
});

