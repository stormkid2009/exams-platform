import "styles/globals.css"; // Global CSS styles
import type { AppProps } from "next/app";
import Layout from "src/components/layouts/main";
import type { NextPageWithLayout } from "src/types/next-page";

/**
 * Custom App component initializes pages.
 *
 * Pages can opt out of the default layout by defining a `getLayout` function
 * (see {@link NextPageWithLayout}). Auth pages and the dashboard use a bare
 * layout; every other page keeps the shared header/footer layout.
 *
 * @param {AppProps} param0 - The props for the application including the active page component and its props.
 * @returns {JSX.Element} The rendered page, wrapped by its own layout or the default one.
 */
export default function App({ Component, pageProps }: AppProps) {
  // Render the page component with its corresponding props.
  const page = <Component {...pageProps} />;
  const { getLayout } = Component as typeof Component & NextPageWithLayout;

  // Delegate to the page's layout when it defines one, otherwise use the main layout.
  return getLayout ? getLayout(page) : <Layout>{page}</Layout>;
}
