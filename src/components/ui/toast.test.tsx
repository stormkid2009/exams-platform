import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast from "./toast";
import "@testing-library/jest-dom";

describe("Toast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the message correctly", () => {
    const message = "This is a test message";
    const onDismiss = jest.fn();
    
    render(
      <Toast
        message={message}
        type="success"
        onDismiss={onDismiss}
      />
    );
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("renders success toast with the correct styles", () => {
    const onDismiss = jest.fn();
    
    render(
      <Toast
        message="Success message"
        type="success"
        onDismiss={onDismiss}
      />
    );
    
    const messageElement = screen.getByText("Success message");
    const containerDiv = messageElement.closest("div");
    const toastContainer = containerDiv?.parentElement;
    
    expect(toastContainer).not.toBeNull();
    expect(toastContainer).toHaveClass("bg-green-100");
    expect(toastContainer).toHaveClass("text-green-700");
    expect(toastContainer).toHaveClass("border-green-200");
    
    // Check for success icon
    const svgElement = toastContainer?.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement?.parentElement).toHaveClass("flex");
  });

  it("renders error toast with the correct styles", () => {
    const onDismiss = jest.fn();
    
    render(
      <Toast
        message="Error message"
        type="error"
        onDismiss={onDismiss}
      />
    );
    
    const messageElement = screen.getByText("Error message");
    const containerDiv = messageElement.closest("div");
    const toastContainer = containerDiv?.parentElement;
    
    expect(toastContainer).not.toBeNull();
    expect(toastContainer).toHaveClass("bg-red-100");
    expect(toastContainer).toHaveClass("text-red-700");
    expect(toastContainer).toHaveClass("border-red-200");
    
    // Check for error icon
    const svgElement = toastContainer?.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  it("calls onDismiss after default duration (3000ms)", () => {
    const onDismiss = jest.fn();
    
    render(
      <Toast
        message="Test message"
        type="success"
        onDismiss={onDismiss}
      />
    );
    
    expect(onDismiss).not.toHaveBeenCalled();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss after custom duration", () => {
    const onDismiss = jest.fn();
    const customDuration = 5000;
    
    render(
      <Toast
        message="Test message"
        type="success"
        onDismiss={onDismiss}
        duration={customDuration}
      />
    );
    
    // Fast-forward time but not enough
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(onDismiss).not.toHaveBeenCalled();
    
    // Fast-forward remaining time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("cleans up timeout on unmount", () => {
    const onDismiss = jest.fn();
    
    const { unmount } = render(
      <Toast
        message="Test message"
        type="success"
        onDismiss={onDismiss}
      />
    );
    
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    // Unmount component
    unmount();
    
    // Check if clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // onDismiss should not be called after unmount
    expect(onDismiss).not.toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it("has the correct position classes", () => {
    const onDismiss = jest.fn();
    
    const { container } = render(
      <Toast
        message="Test message"
        type="success"
        onDismiss={onDismiss}
      />
    );
    
    const toastElement = container.firstChild;
    expect(toastElement).not.toBeNull();
    
    if (toastElement) {
      expect(toastElement).toHaveClass("fixed");
      expect(toastElement).toHaveClass("top-4");
      expect(toastElement).toHaveClass("right-4");
      expect(toastElement).toHaveClass("z-50");
      expect(toastElement).toHaveClass("animate-fade-in");
    }
  });
});