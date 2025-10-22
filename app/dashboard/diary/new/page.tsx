"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface TrainingAction {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function NewDiaryPage() {
  const router = useRouter();
  const [actions, setActions] = useState<TrainingAction[]>([]);
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [actionId, setActionId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await fetch("/api/actions");
      if (response.ok) {
        const data = await response.json();
        setActions(data);
        if (data.length > 0) {
          setActionId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          actionId,
          sets: sets || null,
          reps: reps || null,
          duration: duration || null,
          rating: rating || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "创建失败");
      }

      router.push("/dashboard/diary");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "创建失败");
    } finally {
      setLoading(false);
    }
  };

  const selectedAction = actions.find((a) => a.id === actionId);

  if (actions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/diary"
            className="text-blue-500 hover:text-blue-400 mb-4 inline-block"
          >
            ← 返回日记
          </Link>
          <h1 className="text-3xl font-bold text-white">添加训练记录</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
          <p className="text-zinc-400 mb-4">
            还没有训练动作，请先添加训练动作
          </p>
          <Link
            href="/dashboard/actions/new"
            className="text-blue-500 hover:text-blue-400"
          >
            添加训练动作
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/diary"
          className="text-blue-500 hover:text-blue-400 mb-4 inline-block"
        >
          ← 返回日记
        </Link>
        <h1 className="text-3xl font-bold text-white">添加训练记录</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                训练日期 *
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="actionId"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                训练动作 *
              </label>
              <select
                id="actionId"
                value={actionId}
                onChange={(e) => setActionId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {actions.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.name}
                  </option>
                ))}
              </select>

              {selectedAction && selectedAction.images.length > 0 && (
                <div className="mt-4 relative h-48 bg-zinc-800 rounded overflow-hidden">
                  <Image
                    src={selectedAction.images[0].url}
                    alt={selectedAction.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">训练数据</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sets"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                组数
              </label>
              <input
                type="number"
                id="sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="1"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="3"
              />
            </div>

            <div>
              <label
                htmlFor="reps"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                次数
              </label>
              <input
                type="number"
                id="reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="1"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="10"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                时长（分钟）
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="30"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                完成质量（1-5星）
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">未评分</option>
                <option value="1">⭐ 1星</option>
                <option value="2">⭐⭐ 2星</option>
                <option value="3">⭐⭐⭐ 3星</option>
                <option value="4">⭐⭐⭐⭐ 4星</option>
                <option value="5">⭐⭐⭐⭐⭐ 5星</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            训练心得/备注
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="记录今天的训练感受和心得..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "保存中..." : "保存记录"}
          </button>
          <Link
            href="/dashboard/diary"
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
