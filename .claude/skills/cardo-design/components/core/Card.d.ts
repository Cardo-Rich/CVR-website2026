import * as React from "react";

/**
 * White surface card with soft 24px radius and diffuse navy shadow.
 *
 * @startingPoint section="Core" subtitle="Paper card with soft radius and diffuse shadow" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Inner padding in px. */
  padding?: number;
  /** Lift + deepen shadow on hover. */
  hover?: boolean;
}

export function Card(props: CardProps): JSX.Element;
