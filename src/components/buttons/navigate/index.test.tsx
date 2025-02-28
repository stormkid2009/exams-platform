// NavigateBtn.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigateBtn } from "./index";
import * as nextRouter from "next/router";

describe("NavigateBtn Component", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    // Override useRouter to return our custom pushMock
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      push: pushMock,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the button with the provided children and custom color", () => {
    render(
      <NavigateBtn path="/custom-path" color="red">
        Test Button
      </NavigateBtn>
    );
    const buttonElement = screen.getByRole("button", { name: /Test Button/i });
    expect(buttonElement).toBeInTheDocument();
    // Check that custom color classes are applied
    expect(buttonElement).toHaveClass("bg-red-500");
    expect(buttonElement).toHaveClass("hover:bg-red-600");
  });

  it("calls router.push with the provided path on click", () => {
    render(<NavigateBtn path="/test-path">Click Me</NavigateBtn>);
    const buttonElement = screen.getByRole("button", { name: /Click Me/i });
    fireEvent.click(buttonElement);
    expect(pushMock).toHaveBeenCalledWith("/test-path");
  });

  it("applies the default color 'blue' when no color prop is provided", () => {
    render(<NavigateBtn path="/default">Default Color</NavigateBtn>);
    const buttonElement = screen.getByRole("button", { name: /Default Color/i });
    expect(buttonElement).toHaveClass("bg-blue-500");
    expect(buttonElement).toHaveClass("hover:bg-blue-600");
  });
});
