"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface TrainingAction {
  id: string;
  name: string;
  description: string;
  images: { id: string; url: string }[];
  videos: { id: string; url: string }[];
  createdAt: string;
}

export default function ActionsPage() {
  const [actions, setActions] = useState<TrainingAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await fetch("/api/actions");
      if (response.ok) {
        const data = await response.json();
        setActions(data);
      }
    } catch (error) {
      console.error("Failed to fetch actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个训练动作吗？")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setActions(actions.filter((action) => action.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Failed to delete action:", error);
      alert("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">训练动作</h1>
        <Link
          href="/dashboard/actions/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          添加新动作
        </Link>
      </div>

      {actions.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
          <p className="text-zinc-400 mb-4">还没有训练动作</p>
          <Link
            href="/dashboard/actions/new"
            className="text-blue-500 hover:text-blue-400"
          >
            添加第一个训练动作
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <div
              key={action.id}
              className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
            >
              {action.images.length > 0 ? (
                <div className="relative h-48 bg-zinc-800">
                  <Image
                    src={action.images[0].url}
                    alt={action.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-zinc-800 flex items-center justify-center">
                  <span className="text-6xl">🏀</span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {action.name}
                </h3>
                <p className="text-zinc-400 mb-4 line-clamp-2">
                  {action.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                  {action.images.length > 0 && (
                    <span>{action.images.length} 张图片</span>
                  )}
                  {action.videos.length > 0 && (
                    <span>{action.videos.length} 个视频</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/actions/${action.id}`}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-center py-2 px-4 rounded transition-colors"
                  >
                    查看
                  </Link>
                  <Link
                    href={`/dashboard/actions/${action.id}/edit`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(action.id)}
                    disabled={deletingId === action.id}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {deletingId === action.id ? "删除中..." : "删除"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
