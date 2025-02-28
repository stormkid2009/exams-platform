
import React from "react";
import { render } from "@testing-library/react";
import CopyRights from "./copy-rights"; // Adjust the import path if necessary

describe("CopyRights Component", () => {
  it("renders the copyright message with the current year", () => {
    const { getByText } = render(<CopyRights />);
    const currentYear = new Date().getFullYear();
    expect(getByText(`©${currentYear} ANWAR AHMED`)).toBeInTheDocument();
  });

  it("applies the custom className", () => {
    const { container } = render(<CopyRights className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});