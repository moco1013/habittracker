"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 md:px-6">
        <h1 className="text-lg font-bold">習慣トラッカー</h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 md:inline">
            {session.user.name}
          </span>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "ユーザー"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
