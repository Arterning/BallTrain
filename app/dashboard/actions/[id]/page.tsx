"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface TrainingAction {
  id: string;
  name: string;
  description: string;
  images: { id: string; url: string }[];
  videos: { id: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export default function ActionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [action, setAction] = useState<TrainingAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAction();
  }, [params.id]);

  const fetchAction = async () => {
    try {
      const response = await fetch(`/api/actions/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAction(data);
      } else {
        setError("动作不存在或已被删除");
      }
    } catch (error) {
      console.error("Failed to fetch action:", error);
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这个训练动作吗？")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/actions/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/actions");
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Failed to delete action:", error);
      alert("删除失败");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">加载中...</div>
      </div>
    );
  }

  if (error || !action) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error || "动作不存在"}
        </div>
        <Link
          href="/dashboard/actions"
          className="text-blue-500 hover:text-blue-400"
        >
          ← 返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/actions"
          className="text-blue-500 hover:text-blue-400 mb-4 inline-block"
        >
          ← 返回列表
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {action.name}
            </h1>
            <p className="text-sm text-zinc-500">
              创建于 {new Date(action.createdAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/actions/${action.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              编辑
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "删除中..." : "删除"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 图片展示区域 */}
        {action.images.length > 0 && (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">动作图片</h2>
            </div>
            <div className="p-6">
              {/* 主图片展示 */}
              <div className="relative h-96 bg-zinc-800 rounded-lg overflow-hidden mb-4">
                <Image
                  src={action.images[selectedImageIndex].url}
                  alt={`${action.name} - 图片 ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* 图片缩略图 */}
              {action.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {action.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`缩略图 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 视频展示区域 */}
        {action.videos.length > 0 && (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white">动作视频</h2>
            </div>
            <div className="p-6 space-y-4">
              {action.videos.map((video, index) => (
                <div key={video.id} className="space-y-2">
                  <p className="text-sm text-zinc-400">视频 {index + 1}</p>
                  <div className="relative bg-zinc-800 rounded-lg overflow-hidden">
                    <video
                      src={video.url}
                      controls
                      className="w-full max-h-96"
                      preload="metadata"
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 动作要领 */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">动作要领</h2>
          </div>
          <div className="p-6">
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">统计信息</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {action.images.length}
                </div>
                <div className="text-sm text-zinc-400">图片数量</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {action.videos.length}
                </div>
                <div className="text-sm text-zinc-400">视频数量</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {new Date(action.createdAt).toLocaleDateString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div className="text-sm text-zinc-400">创建日期</div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">
                  {new Date(action.updatedAt).toLocaleDateString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div className="text-sm text-zinc-400">更新日期</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
