import * as React from "react";

/** Property/decor photo tile with gradient fallback, dark scrim, meta pill and serif caption. */
export interface PhotoTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Real photo URL; falls back to the gradient when omitted. */
  img?: string;
  /** Caption shown bottom-left in display serif. */
  tag?: string;
  /** Uppercase pill, top-right. */
  meta?: string;
  /** CSS aspect-ratio, e.g. "4 / 3" or "16 / 9". */
  ratio?: string;
  phA?: string;
  phB?: string;
}

export function PhotoTile(props: PhotoTileProps): JSX.Element;
