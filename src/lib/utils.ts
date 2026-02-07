/** Get today's date as "YYYY-MM-DD" in local timezone */
export function getToday(): string {
  return formatDate(new Date());
}

/** Format a Date to "YYYY-MM-DD" in local timezone */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Get the last 7 days as "YYYY-MM-DD" strings (oldest first) */
export function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

/** Calculate current streak from a sorted array of date strings (newest first) */
export function calculateStreak(checkInDates: string[]): number {
  if (checkInDates.length === 0) return 0;

  const today = getToday();
  const yesterday = formatDate(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );

  // Streak must start from today or yesterday
  if (checkInDates[0] !== today && checkInDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < checkInDates.length; i++) {
    const prev = new Date(checkInDates[i - 1]);
    const curr = new Date(checkInDates[i]);
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
