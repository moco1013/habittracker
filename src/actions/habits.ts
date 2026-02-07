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

  if (!name || name.trim().length === 0) {
    throw new Error("習慣名を入力してください");
  }

  await prisma.habit.create({
    data: {
      name: name.trim(),
      userId,
    },
  });

  revalidatePath("/dashboard");
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
}

export async function toggleCheckIn(habitId: string) {
  const userId = await getAuthUserId();
  const today = getToday();

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
