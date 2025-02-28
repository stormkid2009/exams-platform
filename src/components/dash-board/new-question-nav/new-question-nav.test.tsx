
// NewQuestionNav.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewQuestionNav } from "./index"; // adjust the path as needed
import * as nextRouter from "next/router";

describe("NewQuestionNav Component", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({
      push: pushMock,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all navigation buttons", () => {
    render(<NewQuestionNav />);
    expect(screen.getByRole("button", { name: /Grammaire Form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Situation Form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Passage Form/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Composition Form/i })).toBeInTheDocument();
  });

  it("navigates to the correct paths when buttons are clicked", () => {
    render(<NewQuestionNav />);
    const grammaireBtn = screen.getByRole("button", { name: /Grammaire Form/i });
    const situationBtn = screen.getByRole("button", { name: /Situation Form/i });
    const passageBtn = screen.getByRole("button", { name: /Passage Form/i });
    const compositionBtn = screen.getByRole("button", { name: /Composition Form/i });

    fireEvent.click(grammaireBtn);
    fireEvent.click(situationBtn);
    fireEvent.click(passageBtn);
    fireEvent.click(compositionBtn);

    expect(pushMock.mock.calls).toEqual([
      ["/dash-board/grammaire"],
      ["/dash-board/situation"],
      ["/dash-board/passage"],
      ["/dash-board/composition"],
    ]);
  });
});
