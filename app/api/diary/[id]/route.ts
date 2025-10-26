import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// DELETE - 删除训练日记
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    const entry = await prisma.diaryEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "日记不存在" }, { status: 404 });
    }

    await prisma.diaryEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Failed to delete diary entry:", error);
    return NextResponse.json(
      { error: "删除训练日记失败" },
      { status: 500 }
    );
  }
}

// PUT - 更新训练日记
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    const existingEntry = await prisma.diaryEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "日记不存在" }, { status: 404 });
    }

    const body = await req.json();
    const { date, actionId, reps, sets, duration, notes, rating } = body;

    const entry = await prisma.diaryEntry.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        actionId: actionId || undefined,
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

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to update diary entry:", error);
    return NextResponse.json(
      { error: "更新训练日记失败" },
      { status: 500 }
    );
  }
}
