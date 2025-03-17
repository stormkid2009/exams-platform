import "styles/globals.css"; // Global CSS styles
import type { AppProps } from "next/app";
import Layout from "src/components/layouts/main";

/**
 * Custom App component initializes pages.
 *
 * This component wraps each page in a common layout, ensuring consistent styling
 * and shared components (e.g., header, footer, navigation) across the application.
 *
 * @param {AppProps} param0 - The props for the application including the active page component and its props.
 * @returns {JSX.Element} The rendered page wrapped within the main layout.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      {/* Render the page component with its corresponding props */}
      <Component {...pageProps} />
    </Layout>
  );
}
