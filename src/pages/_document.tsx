import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Document component enables overriding of the default Document markup.
 *
 * This component is used to augment the application's <html> and <body> tags.
 * It is rendered only on the server side and allows you to modify the initial
 * document structure (e.g., add meta tags, scripts).
 *
 * @returns {JSX.Element} The custom document for the Next.js application.
 */
export default function Document() {
  return (
    <Html lang="en">
      {/* Head component for meta tags and external resources */}
      <Head />
      <body>
        {/* Main component renders the page's content */}
        <Main />
        {/* NextScript component injects Next.js scripts */}
        <NextScript />
      </body>
    </Html>
  );
}
