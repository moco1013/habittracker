import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { HabitList } from "@/components/HabitList";
import { AllCompleteQuote } from "@/components/AllCompleteQuote";
import { DateNav } from "@/components/DateNav";
import { getToday } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const today = getToday();
  const selectedDate = params.date || today;
  const isToday = selectedDate === today;

  const selectedDow = String(new Date(selectedDate + "T00:00:00").getDay());

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      checkIns: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const filteredHabits = habits.filter((habit) => {
    const days = (habit.days ?? "0,1,2,3,4,5,6").split(",");
    return days.includes(selectedDow);
  });

  const habitData = filteredHabits.map((habit) => {
    const checkInDates = habit.checkIns.map((c) => c.date);
    const checkInSet = new Set(checkInDates);

    return {
      id: habit.id,
      name: habit.name,
      purpose: habit.purpose,
      isCheckedToday: checkInSet.has(selectedDate),
    };
  });

  const total = habitData.length;
  const checkedCount = habitData.filter((h) => h.isCheckedToday).length;
  const remaining = total - checkedCount;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        <DateNav currentDate={selectedDate} today={today} />
        {total > 0 && (
          <p className="mb-4 text-sm text-slate-500">
            {total}件中 {checkedCount}件完了・残り{remaining}件
          </p>
        )}
        <HabitList habits={habitData} date={selectedDate} />
        {total > 0 && remaining === 0 && <AllCompleteQuote />}
        {total === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg text-slate-400">この日の習慣はありません</p>
          </div>
        )}
      </main>
    </>
  );
}
