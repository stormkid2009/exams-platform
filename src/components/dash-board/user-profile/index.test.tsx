
// UserProfile.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserProfile } from "./index"; // adjust the import path if necessary

describe("UserProfile Component", () => {
  it("renders the email and logout button", () => {
    const testEmail = "user@example.com";
    const onLogoutMock = jest.fn();
    
    render(<UserProfile email={testEmail} onLogout={onLogoutMock} />);
    
    // Check if the email is rendered
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    
    // Check if the logout button is rendered
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("calls onLogout when the logout button is clicked", () => {
    const testEmail = "user@example.com";
    const onLogoutMock = jest.fn();
    
    render(<UserProfile email={testEmail} onLogout={onLogoutMock} />);
    
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(onLogoutMock).toHaveBeenCalledTimes(1);
  });
});
