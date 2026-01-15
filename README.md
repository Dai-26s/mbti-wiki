## MBTI Wiki 人格图鉴与测评

一个面向中文用户的 MBTI 人格图鉴与人格测评网站，支持图鉴浏览、快速测评与深度测评，并针对每一种人格提供生活习惯、代表人物与成长建议。

### 功能概览

- 人格图鉴
  - 展示 16 种 MBTI 人格的代码、别称与说明
  - 查看每种人格的详细描述、常见生活习惯、代表人物、成长建议
  - 卡片式网格布局，支持点击卡片打开毛玻璃风格的详情弹窗

- 人格测评
  - 测评模式选择：快速测评（20 题）与深度测评（80 题）
  - 采用 5 点量表题目（非常不同意 → 非常同意）
  - 覆盖 E/I、S/N、T/F、J/P 四个维度，自动计算 MBTI 类型
  - 显示四个维度的倾向比例（例如 E 60% / I 40%）
  - 每次测评完成后展示结果摘要与该人格的代表人物，并可跳转回图鉴详情
  - 支持上一题返回修改答案，已选选项会保留

- 界面与交互
  - 使用 framer-motion 实现卡片 hover、弹窗出现、题目切换等动效
  - 提供三套整体配色主题（极光、暮光、纯净），可在侧边栏切换
  - 针对标题、段落与列表做了适配中文的排版与层级区分

### 技术栈

- **框架与语言**
  - Next.js 16（App Router）
  - React 19 + TypeScript 5

- **样式与动画**
  - Tailwind CSS 4
  - 自定义渐变背景与玻璃拟态卡片
  - framer-motion：用于题目切换、弹窗、卡片动效

- **工具与配置**
  - ESLint 9 + eslint-config-next：代码质量和规范检查
  - TypeScript 严格类型检查

### 开发与本地运行

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 代码检查
npm run lint

# 生产构建
npm run build
```

默认开发地址为 http://localhost:3000。

### 部署说明（Vercel）

- 本项目已在 `package.json` 中配置：
  - `build`: `next build`
  - `start`: `next start`
- 将代码仓库连接到 Vercel 后，保持默认的：
  - Framework: **Next.js**
  - Build Command: `npm run build`
  - Output: `.next`

保存后即可由 Vercel 自动构建并部署。

