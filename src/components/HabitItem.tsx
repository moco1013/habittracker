"use client";

import { useState, useTransition } from "react";
import { toggleCheckIn } from "@/actions/habits";

type HabitItemProps = {
  id: string;
  name: string;
  purpose: string | null;
  isCheckedToday: boolean;
  date?: string;
};

const CHEER_MESSAGES = [
  "できた！",
  "最高！",
  "すごすぎ！",
  "えらい！",
  "天才！",
  "完璧！",
  "さすが！",
  "やるじゃん！",
  "ナイス！",
  "その調子！",
];

function getRandomCheer() {
  return CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)];
}

function Confetti() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const distance = 40 + Math.random() * 30;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];
    const color = colors[i % colors.length];
    const size = 4 + Math.random() * 4;
    const delay = Math.random() * 0.15;

    return (
      <span
        key={i}
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          animation: `confetti-burst 0.6s ${delay}s ease-out forwards`,
          // @ts-expect-error CSS custom properties
          "--x": `${x}px`,
          "--y": `${y}px`,
        }}
      />
    );
  });

  return <div className="pointer-events-none absolute inset-0">{particles}</div>;
}

export function HabitItem({ id, name, purpose, isCheckedToday, date }: HabitItemProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [cheerMessage, setCheerMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!isCheckedToday) {
      setCheerMessage(getRandomCheer());
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setCheerMessage("");
      }, 1200);
    }
    startTransition(() => toggleCheckIn(id, date));
  };

  return (
    <div className="relative rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              isCheckedToday
                ? "scale-110 border-green-500 bg-green-500 text-white"
                : "border-slate-300 hover:border-green-400 hover:bg-green-50"
            } ${isPending ? "opacity-50" : ""}`}
            aria-label={isCheckedToday ? "チェックを外す" : "チェックする"}
          >
            {isCheckedToday && (
              <svg
                className="h-6 w-6 animate-[check-pop_0.3s_ease-out]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          {showConfetti && <Confetti />}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={`block truncate text-base font-medium transition-all duration-300 ${
              isCheckedToday ? "text-slate-400 line-through" : ""
            }`}
          >
            {name}
          </span>
          {purpose && (
            <span className="block truncate text-xs text-slate-400">
              {purpose}
            </span>
          )}
        </div>

        {cheerMessage && (
          <span className="animate-[cheer-pop_1.2s_ease-out_forwards] text-sm font-bold text-green-500">
            {cheerMessage}
          </span>
        )}
      </div>
    </div>
  );
}
