import * as React from "react";

/** Pill-shaped label/tag chip for metadata, neighborhoods, statuses. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "rose" | "gold" | "sea" | "ink";
}

export function Badge(props: BadgeProps): JSX.Element;
