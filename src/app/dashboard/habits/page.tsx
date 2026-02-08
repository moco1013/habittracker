import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitManageItem } from "@/components/HabitManageItem";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-3 text-xl font-bold">習慣を管理</h2>
          <AddHabitForm />
        </div>
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitManageItem
              key={habit.id}
              id={habit.id}
              name={habit.name}
              purpose={habit.purpose}
              days={habit.days ?? "0,1,2,3,4,5,6"}
            />
          ))}
        </div>
        {habits.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-400">まだ習慣がありません</p>
            <p className="mt-1 text-sm text-slate-400">上のフォームから追加しましょう</p>
          </div>
        )}
      </main>
    </>
  );
}
