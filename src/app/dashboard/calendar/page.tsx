import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
}

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      checkIns: {
        where: {
          date: { startsWith: monthStr },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const calendarDays = getCalendarDays(year, month);

  // Count check-ins per day
  const checkInCounts = new Map<number, number>();
  for (const habit of habits) {
    for (const checkIn of habit.checkIns) {
      const day = parseInt(checkIn.date.split("-")[2]);
      checkInCounts.set(day, (checkInCounts.get(day) ?? 0) + 1);
    }
  }

  const totalHabits = habits.length;
  const today = now.getDate();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        <h2 className="mb-4 text-xl font-bold">
          {year}年{month + 1}月
        </h2>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 grid grid-cols-7 text-center text-xs text-slate-400">
            {DAY_NAMES.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />;
              }
              const count = checkInCounts.get(day) ?? 0;
              const isToday = day === today;
              const ratio = totalHabits > 0 ? count / totalHabits : 0;

              let bgColor = "";
              if (count > 0) {
                if (ratio >= 1) bgColor = "bg-green-400 text-white";
                else if (ratio >= 0.5) bgColor = "bg-green-200";
                else bgColor = "bg-green-100";
              }

              return (
                <div
                  key={day}
                  className={`rounded-lg py-2 ${bgColor} ${
                    isToday ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="size-3 rounded bg-green-100" /> 一部達成
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded bg-green-200" /> 半分以上
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded bg-green-400" /> 全達成
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
