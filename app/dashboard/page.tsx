import { auth } from "../lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          欢迎回来, {session?.user?.name || session?.user?.email}!
        </h1>
        <p className="text-zinc-400">
          开始记录你的篮球训练吧
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/actions"
          className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <div className="text-4xl mb-4">🏀</div>
          <h2 className="text-2xl font-bold text-white mb-2">训练动作</h2>
          <p className="text-zinc-400">
            管理你的训练动作库，添加新动作或编辑现有动作
          </p>
        </Link>

        <Link
          href="/dashboard/diary"
          className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-white mb-2">训练日记</h2>
          <p className="text-zinc-400">
            记录每天的训练内容，查看训练历史和数据统计
          </p>
        </Link>
      </div>
    </div>
  );
}
