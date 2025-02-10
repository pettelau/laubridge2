import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isAfter, subMonths } from "date-fns";
import { nb } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgoNorwegian(date: Date | null): string {
  if (!date) return "-";

  if (!isAfter(date, subMonths(new Date(), 1))) {
    return "mer enn en måned siden";
  }

  const timeAgo =
    "for " +
    formatDistanceToNow(date, {
      locale: nb,
      addSuffix: true,
    });

  // Return "akkurat nå" if less than a minute ago
  if (timeAgo.includes("ett minutt siden")) {
    return "akkurat nå";
  }

  return timeAgo
    .replace("cirka", "ca.")
    .replace("mindre enn", "under")
    .replace("over", "mer enn");
}
