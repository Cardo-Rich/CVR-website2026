import * as React from "react";

/** Headline statistic — large Fraunces number over an uppercase label. */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: React.ReactNode;
  align?: "left" | "center";
  /** Light text for dark/ink surfaces. */
  onDark?: boolean;
}

export function Stat(props: StatProps): JSX.Element;
