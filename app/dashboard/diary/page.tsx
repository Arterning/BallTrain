"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface DiaryEntry {
  id: string;
  date: string;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  notes: string | null;
  rating: number | null;
  action: {
    id: string;
    name: string;
    images: { url: string }[];
  };
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    fetchEntries();
  }, [currentMonth]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/diary?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch diary entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条训练记录吗？")) {
      return;
    }

    try {
      const response = await fetch(`/api/diary/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEntries(entries.filter((entry) => entry.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("删除失败");
    }
  };

  const changeMonth = (delta: number) => {
    const [year, month] = currentMonth.split("-").map(Number);
    const date = new Date(year, month - 1 + delta, 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    setCurrentMonth(newMonth);
  };

  const getMonthCalendar = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const calendar: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) {
      calendar.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(i);
    }

    return calendar;
  };

  const hasEntryOnDate = (day: number) => {
    const [year, month] = currentMonth.split("-").map(Number);
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries.some((entry) => entry.date.startsWith(dateStr));
  };

  const getEntriesForDate = (day: number) => {
    const [year, month] = currentMonth.split("-").map(Number);
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries.filter((entry) => entry.date.startsWith(dateStr));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <h1 className="text-3xl font-bold text-white">训练日记</h1>
        <Link
          href="/dashboard/diary/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          添加记录
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="text-zinc-300 hover:text-white px-4 py-2 rounded transition-colors"
          >
            ← 上个月
          </button>
          <h2 className="text-xl font-semibold text-white">
            {currentMonth.split("-")[0]} 年 {parseInt(currentMonth.split("-")[1])} 月
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="text-zinc-300 hover:text-white px-4 py-2 rounded transition-colors"
          >
            下个月 →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-zinc-400 py-2"
            >
              {day}
            </div>
          ))}
          {getMonthCalendar().map((day, index) => (
            <div
              key={index}
              className={`aspect-square border border-zinc-800 rounded flex items-center justify-center ${
                day
                  ? hasEntryOnDate(day)
                    ? "bg-blue-600/20 border-blue-600/50"
                    : "bg-zinc-800/50"
                  : ""
              }`}
            >
              {day && (
                <div className="text-center">
                  <div className="text-white font-medium">{day}</div>
                  {hasEntryOnDate(day) && (
                    <div className="text-xs text-blue-400 mt-1">
                      {getEntriesForDate(day).length}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">本月训练记录</h2>
        {entries.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-12 text-center">
            <p className="text-zinc-400 mb-4">本月还没有训练记录</p>
            <Link
              href="/dashboard/diary/new"
              className="text-blue-500 hover:text-blue-400"
            >
              添加第一条记录
            </Link>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {entry.action.images.length > 0 ? (
                  <div className="relative w-24 h-24 flex-shrink-0 bg-zinc-800 rounded overflow-hidden">
                    <Image
                      src={entry.action.images[0].url}
                      alt={entry.action.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 bg-zinc-800 rounded flex items-center justify-center text-3xl">
                    🏀
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {entry.action.name}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      删除
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    {entry.sets && (
                      <div>
                        <span className="text-zinc-400 text-sm">组数:</span>{" "}
                        <span className="text-white">{entry.sets}</span>
                      </div>
                    )}
                    {entry.reps && (
                      <div>
                        <span className="text-zinc-400 text-sm">次数:</span>{" "}
                        <span className="text-white">{entry.reps}</span>
                      </div>
                    )}
                    {entry.duration && (
                      <div>
                        <span className="text-zinc-400 text-sm">时长:</span>{" "}
                        <span className="text-white">{entry.duration} 分钟</span>
                      </div>
                    )}
                    {entry.rating && (
                      <div>
                        <span className="text-zinc-400 text-sm">评分:</span>{" "}
                        <span className="text-white">
                          {"⭐".repeat(entry.rating)}
                        </span>
                      </div>
                    )}
                  </div>

                  {entry.notes && (
                    <p className="text-zinc-300 text-sm mt-2">{entry.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
