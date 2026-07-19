export function formatBerlinTime(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}
