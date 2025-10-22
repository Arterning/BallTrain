import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import Link from "next/link";

async function DashboardNav() {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center text-xl font-bold text-white">
              🏀 篮球训练记录
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/dashboard/actions"
                className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                训练动作
              </Link>
              <Link
                href="/dashboard/diary"
                className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                训练日记
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
