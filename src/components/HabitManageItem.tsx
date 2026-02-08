"use client";

import { useState, useTransition } from "react";
import { updateHabit, deleteHabit } from "@/actions/habits";

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

type Props = {
  id: string;
  name: string;
  purpose: string | null;
  days: string;
};

export function HabitManageItem({ id, name, purpose, days }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingPurpose, setEditingPurpose] = useState(false);
  const [purposeValue, setPurposeValue] = useState(purpose ?? "");
  const selectedDays = (days ?? "0,1,2,3,4,5,6").split(",").map(Number);

  const toggleDay = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort();

    if (newDays.length === 0) return;

    startTransition(() => updateHabit(id, { days: newDays.join(",") }));
  };

  const savePurpose = () => {
    setEditingPurpose(false);
    startTransition(() =>
      updateHabit(id, { purpose: purposeValue.trim() || null })
    );
  };

  const handleDelete = () => {
    startTransition(() => deleteHabit(id));
  };

  return (
    <div className={`rounded-xl bg-white p-4 shadow-sm ${isPending ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-slate-300 transition-colors hover:text-red-500"
          aria-label="削除"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {editingPurpose ? (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={purposeValue}
            onChange={(e) => setPurposeValue(e.target.value)}
            placeholder="目的を入力..."
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && savePurpose()}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={savePurpose}
            className="shrink-0 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white"
          >
            保存
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditingPurpose(true)}
          className="mt-1 text-sm text-slate-400 hover:text-slate-600"
        >
          {purpose ? `目的: ${purpose}` : "+ 目的を追加"}
        </button>
      )}

      <div className="mt-2 flex items-center gap-1">
        {DAY_LABELS.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleDay(i)}
            disabled={isPending}
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
    </div>
  );
}
