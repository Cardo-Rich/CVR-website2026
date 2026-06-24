import * as React from "react";

/**
 * Cardo pill button — the brand's primary call to action.
 *
 * @startingPoint section="Core" subtitle="Pill button with rose, ink, and ghost variants" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Rose is the controlled action color. */
  variant?: "primary" | "ink" | "ghost" | "ghost-light";
  size?: "sm" | "md" | "lg";
  /** Full-width button. */
  block?: boolean;
  /** Render as a different element, e.g. "a". */
  as?: "button" | "a";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
