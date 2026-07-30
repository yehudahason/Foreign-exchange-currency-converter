import { useEffect, useState } from "react";

export function useToday() {
  const [today, setToday] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now);

    nextMidnight.setHours(24, 0, 0, 0);

    const timeout = setTimeout(() => {
      setToday(new Date().toISOString().split("T")[0]);
    }, nextMidnight.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, [today]);

  return today;
}
