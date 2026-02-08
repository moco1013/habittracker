"use client";

import { useState, useRef } from "react";
import { addHabit } from "@/actions/habits";

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function AddHabitForm() {
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set("days", selectedDays.join(","));
    await addHabit(formData);
    formRef.current?.reset();
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="新しい習慣を追加..."
          required
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
        >
          追加
        </button>
      </div>
      <input
        type="text"
        name="purpose"
        placeholder="目的（例: 健康のため、集中力を高めるため）"
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
      />
      <div className="mt-3 flex items-center gap-1">
        <span className="mr-1 text-xs text-slate-400">曜日:</span>
        {DAY_LABELS.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleDay(i)}
            className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
              selectedDays.includes(i)
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}
