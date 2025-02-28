
import React from "react";
import { render } from "@testing-library/react";
import Footer from "./index"; // Adjust the import path if necessary

describe("Footer Component", () => {
  it("renders the CopyRights component", () => {
    const { getByText } = render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(getByText(`©${currentYear} ANWAR AHMED`)).toBeInTheDocument();
  });

  it("has the correct footer classes", () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass("w-full rounded-b-lg bg-slate-700 text-white py-4");
  });
});