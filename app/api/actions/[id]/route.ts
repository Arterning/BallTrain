import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET - 获取单个训练动作
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    const action = await prisma.trainingAction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        images: true,
        videos: true,
      },
    });

    if (!action) {
      return NextResponse.json({ error: "训练动作不存在" }, { status: 404 });
    }

    return NextResponse.json(action);
  } catch (error) {
    console.error("Failed to fetch action:", error);
    return NextResponse.json(
      { error: "获取训练动作失败" },
      { status: 500 }
    );
  }
}

// PUT - 更新训练动作
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
    const body = await req.json();
    const { name, description, images, videos } = body;

    // 检查动作是否存在且属于当前用户
    const existingAction = await prisma.trainingAction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAction) {
      return NextResponse.json({ error: "训练动作不存在" }, { status: 404 });
    }

    // 删除旧的图片和视频
    await prisma.actionImage.deleteMany({
      where: { actionId: id },
    });
    await prisma.actionVideo.deleteMany({
      where: { actionId: id },
    });

    // 更新动作
    const action = await prisma.trainingAction.update({
      where: { id },
      data: {
        name,
        description,
        images: {
          create: images?.map((url: string) => ({ url })) || [],
        },
        videos: {
          create: videos?.map((url: string) => ({ url })) || [],
        },
      },
      include: {
        images: true,
        videos: true,
      },
    });

    return NextResponse.json(action);
  } catch (error) {
    console.error("Failed to update action:", error);
    return NextResponse.json(
      { error: "更新训练动作失败" },
      { status: 500 }
    );
  }
}

// DELETE - 删除训练动作
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

    // 检查动作是否存在且属于当前用户
    const existingAction = await prisma.trainingAction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingAction) {
      return NextResponse.json({ error: "训练动作不存在" }, { status: 404 });
    }

    // 删除动作（会级联删除关联的图片和视频）
    await prisma.trainingAction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Failed to delete action:", error);
    return NextResponse.json(
      { error: "删除训练动作失败" },
      { status: 500 }
    );
  }
}
