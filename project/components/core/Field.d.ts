import * as React from "react";

/** Labeled form control: text input, textarea, or select with rose focus ring. */
export interface FieldProps {
  label?: string;
  as?: "input" | "textarea" | "select";
  id?: string;
  /** For select: array of strings or { label, value }. */
  options?: Array<string | { label: string; value: string }>;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler;
  style?: React.CSSProperties;
}

export function Field(props: FieldProps): JSX.Element;
