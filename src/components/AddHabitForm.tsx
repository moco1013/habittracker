"use client";

import { useRef } from "react";
import { addHabit } from "@/actions/habits";

export function AddHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addHabit(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-2 md:flex-row"
    >
      <input
        type="text"
        name="name"
        placeholder="新しい習慣を入力..."
        required
        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
      <button
        type="submit"
        className="min-h-[48px] rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        追加
      </button>
    </form>
  );
}
