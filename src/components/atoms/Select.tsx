import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cn("min-h-11 w-full rounded-xl border border-line bg-surface px-3 text-base font-semibold text-ink focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40", props.className)} />;
}
