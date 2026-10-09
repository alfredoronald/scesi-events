import { cn } from "@/lib/cn";

/** Avatar con iniciales sobre el rojo de marca. */
export function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        "bg-scesi-red-normal text-xs font-semibold text-white",
        className,
      )}
    >
      {initials}
    </span>
  );
}
