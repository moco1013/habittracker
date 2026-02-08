"use server";

import { auth } from "../../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getToday } from "@/lib/utils";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }
  return session.user.id;
}

export async function addHabit(formData: FormData) {
  const userId = await getAuthUserId();
  const name = formData.get("name") as string;
  const purpose = formData.get("purpose") as string;
  const days = formData.get("days") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("習慣名を入力してください");
  }

  await prisma.habit.create({
    data: {
      name: name.trim(),
      purpose: purpose?.trim() || null,
      days: days || "0,1,2,3,4,5,6",
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habits");
}

export async function updateHabit(habitId: string, data: { days?: string; purpose?: string | null }) {
  const userId = await getAuthUserId();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== userId) {
    throw new Error("この習慣にアクセスする権限がありません");
  }

  await prisma.habit.update({
    where: { id: habitId },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habits");
}

export async function deleteHabit(habitId: string) {
  const userId = await getAuthUserId();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== userId) {
    throw new Error("この習慣を削除する権限がありません");
  }

  await prisma.habit.delete({
    where: { id: habitId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habits");
}

export async function toggleCheckIn(habitId: string, date?: string) {
  const userId = await getAuthUserId();
  const today = date || getToday();

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== userId) {
    throw new Error("この習慣にアクセスする権限がありません");
  }

  const existing = await prisma.checkIn.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: today,
      },
    },
  });

  if (existing) {
    await prisma.checkIn.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.checkIn.create({
      data: {
        habitId,
        date: today,
      },
    });
  }

  revalidatePath("/dashboard");
}
