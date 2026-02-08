"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Props = {
  currentDate: string; // "YYYY-MM-DD"
  today: string;
};

const DOW = "日月火水木金土";

export function DateNav({ currentDate, today }: Props) {
  const d = new Date(currentDate + "T00:00:00");
  const label = `${d.getMonth() + 1}月${d.getDate()}日（${DOW[d.getDay()]}）`;
  const isToday = currentDate === today;

  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  const next = new Date(d);
  next.setDate(next.getDate() + 1);

  const prevDate = formatDate(prev);
  const nextDate = formatDate(next);
  const isFuture = nextDate > today;

  return (
    <div className="mb-4 flex items-center justify-between">
      <Link
        href={`/dashboard?date=${prevDate}`}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="前の日"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="text-center">
        <p className="text-lg font-bold">{label}</p>
        {isToday && <span className="text-xs text-blue-500">今日</span>}
      </div>

      {isFuture ? (
        <div className="w-9" />
      ) : (
        <Link
          href={nextDate === today ? "/dashboard" : `/dashboard?date=${nextDate}`}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="次の日"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
