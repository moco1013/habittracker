import { HabitItem } from "./HabitItem";

type HabitData = {
  id: string;
  name: string;
  streak: number;
  weeklyCheckIns: boolean[];
  weeklyLabels: string[];
  isCheckedToday: boolean;
};

export function HabitList({ habits }: { habits: HabitData[] }) {
  if (habits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        <p className="text-lg">まだ習慣がありません</p>
        <p className="mt-1 text-sm">上のフォームから追加してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} {...habit} />
      ))}
    </div>
  );
}
