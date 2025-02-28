
// NewTestNav.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewTestNav } from "./index";
import * as nextRouter from "next/router";

describe("NewTestNav Component", () => {
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

  it("renders two buttons with the correct labels", () => {
    render(<NewTestNav />);
    expect(
      screen.getByRole("button", { name: /Generate New Exam/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Exam History/i })
    ).toBeInTheDocument();
  });

  it("navigates to the correct path when the 'Generate New Exam' button is clicked", () => {
    render(<NewTestNav />);
    const generateExamBtn = screen.getByRole("button", { name: /Generate New Exam/i });
    fireEvent.click(generateExamBtn);
    expect(pushMock).toHaveBeenCalledWith("/dash-board/generate-exam");
  });

  it("navigates to the correct path when the 'Exam History' button is clicked", () => {
    render(<NewTestNav />);
    const examHistoryBtn = screen.getByRole("button", { name: /Exam History/i });
    fireEvent.click(examHistoryBtn);
    expect(pushMock).toHaveBeenCalledWith("/dash-board/exam-history");
  });
});
