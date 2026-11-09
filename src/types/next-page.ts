// src/types/next-page.ts
import type { ReactElement } from "react";

/**
 * Signature for a per-page layout wrapper.
 *
 * Receives the rendered page and returns it wrapped in whatever chrome the
 * page needs (or returned untouched for a bare layout).
 */
export type GetLayout = (page: ReactElement) => ReactElement;

/**
 * Page component augmented with an optional `getLayout` function.
 *
 * When a page defines `getLayout`, `_app.tsx` delegates the layout decision to
 * the page instead of applying the default main layout.
 */
export type NextPageWithLayout = {
  getLayout?: GetLayout;
};
