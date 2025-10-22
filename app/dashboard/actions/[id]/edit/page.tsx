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
}

export default function EditActionPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAction();
  }, [params.id]);

  const fetchAction = async () => {
    try {
      const response = await fetch(`/api/actions/${params.id}`);
      if (response.ok) {
        const data: TrainingAction = await response.json();
        setName(data.name);
        setDescription(data.description);
        setImages(data.images.map((img) => img.url));
        setVideos(data.videos.map((vid) => vid.url));
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("上传失败");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      if (type === "image") {
        setImages([...images, ...uploadedUrls]);
      } else {
        setVideos([...videos, ...uploadedUrls]);
      }
    } catch (error) {
      setError("文件上传失败");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/actions/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, images, videos }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "更新失败");
      }

      router.push(`/dashboard/actions/${params.id}`);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "更新失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">加载中...</div>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <Link
          href="/dashboard/actions"
          className="text-purple-400 hover:text-purple-300"
        >
          ← 返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/actions/${params.id}`}
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← 返回详情
        </Link>
        <h1 className="text-3xl font-bold text-white">编辑训练动作</h1>
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
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                动作名称 *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="例如：三步上篮"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                动作要领 *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="描述动作的关键要点和注意事项..."
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">动作图片</h3>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "image")}
                disabled={uploading}
                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 bg-zinc-800 rounded overflow-hidden">
                      <Image
                        src={url}
                        alt={`图片 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">动作视频</h3>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload(e, "video")}
                disabled={uploading}
                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
              />
            </div>

            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-800 p-3 rounded"
                  >
                    <video src={url} className="h-20 rounded" controls />
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {uploading && (
          <div className="text-center text-zinc-400">上传文件中...</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "保存中..." : "保存修改"}
          </button>
          <Link
            href={`/dashboard/actions/${params.id}`}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
