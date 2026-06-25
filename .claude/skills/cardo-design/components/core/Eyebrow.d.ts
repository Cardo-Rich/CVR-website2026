import * as React from "react";

/** Uppercase overline with a brass rule; sits above section headings. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  center?: boolean;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
