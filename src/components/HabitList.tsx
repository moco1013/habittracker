import { HabitItem } from "./HabitItem";

type HabitData = {
  id: string;
  name: string;
  purpose: string | null;
  isCheckedToday: boolean;
};

export function HabitList({ habits, date }: { habits: HabitData[]; date?: string }) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} {...habit} date={date} />
      ))}
    </div>
  );
}
