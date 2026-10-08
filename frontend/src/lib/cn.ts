export type ClassValue = string | number | null | undefined | false;

/** Une classNames ignorando los falsy. Sin dependencias. */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
