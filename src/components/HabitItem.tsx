"use client";

import { toggleCheckIn, deleteHabit } from "@/actions/habits";

type HabitItemProps = {
  id: string;
  name: string;
  streak: number;
  weeklyCheckIns: boolean[]; // 7 booleans, oldest to newest
  weeklyLabels: string[]; // 7 day labels
  isCheckedToday: boolean;
};

export function HabitItem({
  id,
  name,
  streak,
  weeklyCheckIns,
  weeklyLabels,
  isCheckedToday,
}: HabitItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 md:p-4">
      {/* Row 1: Check button + name + delete */}
      <div className="flex items-center gap-3">
        <form action={() => toggleCheckIn(id)}>
          <button
            type="submit"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isCheckedToday
                ? "border-green-500 bg-green-500 text-white"
                : "border-slate-300 hover:border-green-400"
            }`}
            aria-label={isCheckedToday ? "チェックを外す" : "チェックする"}
          >
            {isCheckedToday && (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </form>
        <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
        <form action={() => deleteHabit(id)}>
          <button
            type="submit"
            className="p-2 text-slate-400 transition-colors hover:text-red-500"
            aria-label="削除"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </form>
      </div>

      {/* Row 2: Streak + weekly dots */}
      <div className="mt-2 flex items-center gap-3 pl-[52px]">
        {streak > 0 && (
          <span className="shrink-0 text-sm font-medium text-orange-500">
            🔥 {streak}日
          </span>
        )}
        <div className="flex items-center gap-1">
          {weeklyCheckIns.map((checked, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full md:h-5 md:w-5 ${
                  checked ? "bg-green-400" : "bg-slate-200"
                }`}
              />
              <span className="mt-0.5 text-[10px] text-slate-400">
                {weeklyLabels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
