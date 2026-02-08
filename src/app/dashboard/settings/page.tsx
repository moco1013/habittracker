import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { Header } from "@/components/Header";
import Image from "next/image";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        <h2 className="mb-4 text-xl font-bold">設定</h2>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-500">アカウント</h3>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "ユーザー"}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-bold">{session.user.name}</p>
              <p className="text-sm text-slate-500">{session.user.email}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
