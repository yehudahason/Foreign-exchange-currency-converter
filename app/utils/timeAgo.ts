export function timeAgo(date: Date) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    return `${Math.floor(diff / minute)}M`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}H`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}
