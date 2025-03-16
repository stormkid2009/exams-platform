// src/components/layouts/main.tsx
import React from "react";
import Header from "src/components/header";
import Footer from "src/components/footer";

/**
 * Layout Component
 * 
 * This component serves as a layout wrapper for the application, 
 * providing a consistent structure that includes a header, 
 * a scrollable main content area, and a footer.
 * 
 * Props:
 * - children (React.ReactNode): The content to be rendered within the layout.
 * 
 * The layout is styled to fill the full height of the screen, 
 * with a background color and text color that enhance readability.
 * 
 * The header and footer are sized to their content, 
 * while the main content area is scrollable and avoids overlap.
 */
type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen bg-slate-300 text-gray-900 flex flex-col min-h-0">
      {/* Header that sizes to content */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* Scrollable main content that avoids overlap */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto min-h-full">
          {children}
        </div>
      </main>

      {/* Footer that sizes to content */}
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;