import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./index";
import "@testing-library/jest-dom";

// Mock the Header and Footer components with the correct module paths
// Using jest.mock with the actual import paths used in the component
jest.mock("src/components/header", () => {
  return jest.fn(() => <div data-testid="mock-header">Header Component</div>);
}, { virtual: true });

jest.mock("src/components/footer", () => {
  return jest.fn(() => <div data-testid="mock-footer">Footer Component</div>);
}, { virtual: true });

describe("Layout", () => {
  it("renders Header component", () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("renders Footer component", () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders children content", () => {
    const testContent = "Test child content";
    
    render(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
  
  it("has the correct structure and classes", () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    // Main container
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("w-full");
    expect(mainContainer).toHaveClass("h-screen");
    expect(mainContainer).toHaveClass("bg-slate-300");
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
    
    // Main content area
    const mainContent = container.querySelector("main");
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass("flex-1");
    expect(mainContent).toHaveClass("overflow-y-auto");
    expect(mainContent).toHaveClass("p-4");
    
    // Content container
    const contentContainer = mainContent?.querySelector("div");
    expect(contentContainer).toHaveClass("bg-white");
    expect(contentContainer).toHaveClass("rounded-lg");
    expect(contentContainer).toHaveClass("shadow");
    expect(contentContainer).toHaveClass("max-w-4xl");
    expect(contentContainer).toHaveClass("mx-auto");
  });
  
  it("has the correct layout order: header, main content, footer", () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    const children = container.firstChild?.childNodes;
    
    // Check order of elements
    expect(children?.length).toBe(3);
    
    if (children) {
      // First child should contain header
      expect(children[0]).toContainElement(screen.getByTestId("mock-header"));
      
      // Second child should be main content
      expect(children[1].nodeName).toBe("MAIN");
      
      // Third child should contain footer
      expect(children[2]).toContainElement(screen.getByTestId("mock-footer"));
    }
  });
});