import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET - 获取所有训练动作
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const actions = await prisma.trainingAction.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        images: true,
        videos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Failed to fetch actions:", error);
    return NextResponse.json(
      { error: "获取训练动作失败" },
      { status: 500 }
    );
  }
}

// POST - 创建新的训练动作
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, images, videos } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "请填写动作名称和要领" },
        { status: 400 }
      );
    }

    const action = await prisma.trainingAction.create({
      data: {
        name,
        description,
        userId: session.user.id,
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

    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error("Failed to create action:", error);
    return NextResponse.json(
      { error: "创建训练动作失败" },
      { status: 500 }
    );
  }
}
