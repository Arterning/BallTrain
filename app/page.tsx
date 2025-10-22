import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "./lib/auth";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <main className="w-full max-w-4xl text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            篮球训练记录系统
          </h1>
          <p className="text-xl text-zinc-400">
            记录你的训练动作，跟踪你的进步
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <div className="text-3xl mb-3">🏀</div>
            <h3 className="text-lg font-semibold text-white mb-2">训练动作库</h3>
            <p className="text-zinc-400">
              记录所有训练动作，包含动作要领、图片和视频
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold text-white mb-2">训练日记</h3>
            <p className="text-zinc-400">
              每日记录训练内容，跟踪训练数据和心得
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">数据统计</h3>
            <p className="text-zinc-400">
              日历视图展示训练历史，轻松查看训练进度
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            登录
          </Link>
          <Link
            href="/auth/register"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-zinc-700"
          >
            注册
          </Link>
        </div>
      </main>
    </div>
  );
}
