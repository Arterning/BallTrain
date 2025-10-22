import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET - 获取训练日记（支持按月份筛选）
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // format: YYYY-MM

    let whereClause: any = {
      userId: session.user.id,
    };

    if (month) {
      const [year, monthNum] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);

      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const entries = await prisma.diaryEntry.findMany({
      where: whereClause,
      include: {
        action: {
          select: {
            id: true,
            name: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch diary entries:", error);
    return NextResponse.json(
      { error: "获取训练日记失败" },
      { status: 500 }
    );
  }
}

// POST - 创建训练日记
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await req.json();
    const { date, actionId, reps, sets, duration, notes, rating } = body;

    if (!date || !actionId) {
      return NextResponse.json(
        { error: "请选择日期和动作" },
        { status: 400 }
      );
    }

    const entry = await prisma.diaryEntry.create({
      data: {
        date: new Date(date),
        actionId,
        userId: session.user.id,
        reps: reps ? parseInt(reps) : null,
        sets: sets ? parseInt(sets) : null,
        duration: duration ? parseInt(duration) : null,
        notes,
        rating: rating ? parseInt(rating) : null,
      },
      include: {
        action: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Failed to create diary entry:", error);
    return NextResponse.json(
      { error: "创建训练日记失败" },
      { status: 500 }
    );
  }
}
