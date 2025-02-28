// HomeBtn.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import HomeBtn from "./index"; // adjust the import path if needed

describe("HomeBtn Component", () => {
  it("renders a button with the correct text", () => {
    render(<HomeBtn />);
    const buttonElement = screen.getByRole("button", { name: /Back to Dash/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("wraps the button in a link that navigates to '/dash-board'", () => {
    const { container } = render(<HomeBtn />);
    const linkElement = container.querySelector("a");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/dash-board");
  });
});
