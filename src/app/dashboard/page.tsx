import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitList } from "@/components/HabitList";
import { getLast7Days, getToday, calculateStreak } from "@/lib/utils";

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const today = getToday();
  const last7Days = getLast7Days();

  // Day labels for the last 7 days
  const weeklyLabels = last7Days.map((dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return DAY_NAMES[d.getDay()];
  });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      checkIns: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const habitData = habits.map((habit) => {
    const checkInDates = habit.checkIns.map((c) => c.date);
    const checkInSet = new Set(checkInDates);

    return {
      id: habit.id,
      name: habit.name,
      streak: calculateStreak(checkInDates),
      weeklyCheckIns: last7Days.map((d) => checkInSet.has(d)),
      weeklyLabels,
      isCheckedToday: checkInSet.has(today),
    };
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold">今日の習慣</h2>
          <AddHabitForm />
        </div>
        <HabitList habits={habitData} />
      </main>
    </div>
  );
}
