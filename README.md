# 篮球训练记录系统

一个用于记录篮球训练动作和训练日记的 Web 应用。

## 功能特性

- 用户认证系统（登录/注册）
- 训练动作管理
  - 创建、查看、编辑、删除训练动作
  - 为每个动作添加名称、要领描述
  - 支持上传多张图片和多个视频
- 训练日记
  - 记录每日训练内容
  - 记录训练次数、组数、时长
  - 添加训练心得和质量评分（1-5星）
  - 日历视图展示训练历史
  - 按月份查看和切换

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS (Dark Theme)
- **数据库**: SQLite
- **ORM**: Prisma
- **认证**: NextAuth.js
- **包管理**: pnpm

## 开始使用

### 1. 安装依赖

```bash
pnpm install
```

### 2. 设置环境变量

已经包含 `.env` 文件，你可以修改其中的配置：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 初始化数据库

数据库已经通过 Prisma 迁移创建。如果需要重新创建：

```bash
pnpm prisma migrate dev
```

### 4. 运行开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

1. **注册账号**: 首次使用需要先注册一个账号
2. **登录**: 使用注册的邮箱和密码登录
3. **添加训练动作**:
   - 进入"训练动作"页面
   - 点击"添加新动作"
   - 填写动作名称和要领
   - 上传相关的图片和视频
4. **记录训练日记**:
   - 进入"训练日记"页面
   - 点击"添加记录"
   - 选择日期和训练动作
   - 记录训练数据和心得
5. **查看训练历史**:
   - 在日记页面查看日历视图
   - 切换月份查看不同时间的训练记录

## 项目结构

```
app/
├── api/                    # API 路由
│   ├── actions/           # 训练动作 API
│   ├── auth/              # 认证 API
│   ├── diary/             # 训练日记 API
│   └── upload/            # 文件上传 API
├── auth/                   # 认证页面
│   ├── login/             # 登录
│   └── register/          # 注册
├── dashboard/              # 主应用页面
│   ├── actions/           # 训练动作管理
│   └── diary/             # 训练日记
├── components/             # React 组件
├── lib/                    # 工具函数
│   ├── auth.ts            # NextAuth 配置
│   └── prisma.ts          # Prisma 客户端
└── types/                  # TypeScript 类型定义

prisma/
└── schema.prisma          # 数据库模型定义

public/
└── uploads/               # 上传的文件存储目录
```

## 数据库模型

- **User**: 用户信息
- **TrainingAction**: 训练动作（包含名称、要领、图片、视频）
- **ActionImage**: 动作图片
- **ActionVideo**: 动作视频
- **DiaryEntry**: 训练日记（包含日期、动作、训练数据、评分、心得）

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行 ESLint
pnpm lint

# Prisma 命令
pnpm prisma studio        # 打开数据库管理界面
pnpm prisma migrate dev   # 创建新的迁移
pnpm prisma generate      # 生成 Prisma 客户端
```

## 注意事项

- 上传的图片和视频存储在 `public/uploads/` 目录
- 数据库文件 `dev.db` 位于 `prisma/` 目录
- 生产环境需要更改 `NEXTAUTH_SECRET` 为安全的随机字符串
- 建议定期备份数据库文件
