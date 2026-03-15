# 📄 PRD 方案二：文章内容转 PPT/Slide 幻灯片 + 口播音频 生成视频

> **文档版本**：v1.0  
> **创建日期**：2026-03-15  
> **方案定位**：方案一（Remotion）的补充与替代方案  
> **适用场景**：图文并茂、展示型、知识卡片类视频

---

## 1. 为什么需要方案二：Remotion 的局限性

方案一（Remotion）适合动画型、程序化的视频，但在以下场景表现不足，催生了方案二。

### 1.1 视觉美观性上限偏低

Remotion 本质是**用代码绘制视频**——所有元素都是 React 组件渲染的 HTML/CSS 画面，受限于此：

| 场景需求 | Remotion 表现 |
|---------|--------------|
| 纯文字动画、逐步揭示内容 | ✅ 非常擅长 |
| 大量图片展示、图文混排 | ⚠️ 布局能力有限，难以匹配设计师水准 |
| 专业排版、复杂阴影、渐变质感 | ⚠️ CSS 能力有天花板 |
| 杂志风、海报风、品牌感强的画面 | ❌ 写代码难以实现 |
| 视频素材穿插（B-roll、实拍画面） | ❌ 支持但整合繁琐 |

### 1.2 图文并茂场景表现差

文章常含截图、信息图、流程图等复杂图片，Remotion 虽能嵌入 `<Img>` 但：
- **图片缩放/裁剪**缺乏智能感知（不知道图片重点在哪）
- **多图布局**需手工写 `position/grid`，代码量大且效果普通
- **图文呼应关系**（图片讲什么、文字解释哪）无法自动建立视觉联系

### 1.3 开发与调试成本高

```
写 React 组件 → 查看预览 → 调整参数 → 重新预览 → 反复迭代
```

- 动画参数（spring damping、interpolate 范围）需反复手动调试
- 每次改动需热更新，对非工程师非常不友好
- 渲染速度慢：基于 Chromium 逐帧截图，5 分钟视频可能需 10–30 分钟渲染

### 1.4 富媒体内容支持有限

| 内容类型 | Remotion 支持度 |
|---------|---------------|
| 手写字、笔迹动画 | ❌ |
| 粒子效果、液态动画 | ❌（性能问题）|
| 杂志级图文排版 | ❌ |
| 3D 场景 | ⚠️（需 Three.js，门槛极高）|

### 1.5 两种方案核心对比

| 维度 | 方案一 Remotion | 方案二 PPT/Slide |
|------|---------------|----------------|
| 视觉效果 | 代码驱动，中等 | 设计工具/AI 生成，高质量 |
| 图文并茂 | 弱 | 强（每张幻灯片独立设计）|
| 开发门槛 | 高（需写 React）| 低（模板/AI 生成）|
| 生成速度 | 慢（逐帧渲染）| 快（导出图片 + 音视频合成）|
| 批量化 | 高（代码自动化）| 中（需模板适配）|
| **最适合内容** | **动画/教学/数据可视化** | **图文/分享/知识卡片** |

---

## 2. 方案二核心思路

```
文章内容
   ↓ AI 解析 + 排版引擎
PPT/Slide 幻灯片（每页一张图）
   ↓ 导出为图片序列
图片序列 + AI 配音 MP3
   ↓ FFmpeg 合成
最终视频 MP4
```

**关键洞察**：
- 幻灯片生成工具（Gamma、Canva、Marp、reveal.js 等）对图文排版的支持远超代码手写
- 把幻灯片导出为图片后，用 FFmpeg 按配音时长合成视频，技术难度低、速度快
- 每张幻灯片作为"静帧"对应一段配音，结构简单清晰

---

## 3. 目标与成功指标

### 3.1 产品目标

1. **视觉质量优先**：每张幻灯片达到「设计工具」级别的排版质量
2. **生成速度提速**：相比方案一，渲染速度提升 3–5 倍
3. **低门槛操作**：无需写 React/CSS 代码即可完成全流程
4. **灵活切换**：与方案一共享 Init / Plan 两个阶段，复用率高

### 3.2 成功指标

| 指标 | 目标值 |
|------|--------|
| 全流程耗时 | ≤ 30 分钟（比方案一快 2x）|
| 幻灯片生成质量 | 媲美 Gamma/Canva 自动生成效果 |
| 视频输出格式 | 横屏 16:9 / 竖屏 9:16 |
| 渲染成功率 | ≥ 98%（FFmpeg 稳定性高）|

---

## 4. 用户故事

```
作为一名内容创作者，
我希望输入一篇图文丰富的公众号文章，
能够自动生成每页精美幻灯片配上 AI 口播的讲解视频，
视觉质量达到 Gamma/小红书图文卡片的水准，
以便发布到抖音、视频号、B站等平台。
```

### 适用场景

| 场景 | 说明 |
|------|------|
| 图文丰富的文章 | 含大量配图、截图、信息图 |
| 知识分享类内容 | 观点、干货、方法论 |
| 「小红书风格」卡片视频 | 每页一个知识点，简洁美观 |
| 快速产出场景 | 30 分钟内完成从文章到视频 |

---

## 5. 核心工作流（5 阶段）

```
[文章输入] → Stage 1: Init → Stage 2: Plan → Stage 3: Slide生成 → Stage 4: Audio → Stage 5: 合成输出
```

> Stage 1 和 Stage 2 与方案一完全相同，可复用。

---

### Stage 1：Init — 内容提取（与方案一共用）

**输入**：URL 或本地 `.md` / `.txt` 文件

**处理**：
1. 抓取正文、标题、图片（URL 输入时）
2. 创建项目目录：`projects/{slug}/`
   - `assets/` — 本地化素材图片
   - `slides/` — 导出的幻灯片图片
   - `audio/` — TTS 配音文件
3. 下载并本地化所有原文图片

**输出**：`projects/{slug}/content.json`

---

### Stage 2：Plan — 脚本与分页规划

**目标**：将文章内容映射为幻灯片页面结构 + 口播逐字稿。

**处理步骤**：
1. **内容分页**：每个「知识点」或「段落」对应一张幻灯片
2. **页面类型规划**：
   - `cover` — 封面页（标题 + 副标题 + 封面图）
   - `point` — 观点页（1 个核心论点 + 支撑文字）
   - `image` — 图片页（配图为主 + 简短说明）
   - `list` — 列表页（3–5 个要点）
   - `quote` — 引用页（金句 + 作者）
   - `outro` — 结尾页（总结 + CTA）
3. **口播脚本生成**：为每张幻灯片生成 10–30 秒的口播旁白
4. **⚠️ 人工审核点**：输出分页预览，确认后继续

**输出**：
```json
{
  "title": "文章标题",
  "theme": "modern-dark",
  "slides": [
    {
      "id": "slide-01",
      "type": "cover",
      "headline": "核心标题",
      "body": "副标题或摘要",
      "image": "assets/cover.jpg",
      "narration": "口播旁白文本...",
      "estimatedDuration": 12.5
    }
  ]
}
```

---

### Stage 3：Slide 生成 — 幻灯片制作

**目标**：将分页脚本转化为高质量幻灯片图片。

#### 3.1 技术路线选择

| 方案 | 工具 | 优点 | 缺点 |
|------|------|------|------|
| **A. Marp（推荐）** | Markdown → PPT/PDF/图片 | 纯代码驱动、可批量、主题可定制 | 需学 Marp 语法 |
| **B. reveal.js** | HTML 演示框架 | 高度可定制、支持动画 | 需写 HTML/JS |
| **C. Gamma API** | AI 生成幻灯片 | 最美观、AI 自动排版 | 有 API 限制和费用 |
| **D. Puppeteer 截图** | 渲染 HTML → 截图 | 完全自定义排版 | 需维护 HTML 模板 |

**推荐组合**：**Marp**（快速） + **Puppeteer 截图**（高质量自定义）

#### 3.2 Marp 方案实现

```bash
# 安装
npm install -g @marp-team/marp-cli

# 从 Markdown 生成图片
marp slides.md --images png --output projects/{slug}/slides/
```

**Marp 幻灯片模板示例**（`slides.md`）：

```markdown
---
marp: true
theme: gaia
style: |
  section {
    background: #0f172a;
    color: #f1f5f9;
    font-family: 'Inter', sans-serif;
    padding: 60px 80px;
  }
  h1 { color: #38bdf8; font-size: 2.5em; }
  .highlight { background: #1e40af; padding: 0 8px; border-radius: 4px; }
---

<!-- 封面页 -->
# 文章标题

副标题或核心观点

![bg right:40%](assets/cover.jpg)

---

<!-- 观点页 -->
# 核心论点

- 要点一：详细说明
- 要点二：详细说明
- 要点三：详细说明

---

<!-- 引用页 -->
> "金句内容在这里"

— 引用来源

---
```

#### 3.3 Puppeteer 高质量截图方案

针对需要更精细排版的场景：

```typescript
// generate-slides.ts
import puppeteer from "puppeteer";
import { slides } from "./script.json";

const browser = await puppeteer.launch();
const page = await browser.newPage();

// 横屏 1920×1080
await page.setViewport({ width: 1920, height: 1080 });

for (const slide of slides) {
  const html = renderSlideTemplate(slide);       // 渲染 HTML 模板
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({
    path: `projects/${slug}/slides/${slide.id}.png`,
    type: "png",
  });
}

await browser.close();
```

**幻灯片 HTML 模板结构**：

```typescript
const renderSlideTemplate = (slide: Slide): string => {
  // 根据 slide.type 选择不同布局模板
  const templates = {
    cover:  CoverTemplate(slide),
    point:  PointTemplate(slide),
    image:  ImageTemplate(slide),
    list:   ListTemplate(slide),
    quote:  QuoteTemplate(slide),
    outro:  OutroTemplate(slide),
  };
  return templates[slide.type];
};
```

#### 3.4 视觉设计规范

| 规范项 | 横屏版 | 竖屏版 |
|--------|--------|--------|
| 分辨率 | 1920 × 1080 | 1080 × 1920 |
| 主色调 | 深色系（`#0f172a`）/ 浅色系可切换 | 同左 |
| 字体 | Inter（英文）/ 思源黑体（中文）| 同左 |
| 安全内边距 | 60px 上下，80px 左右 | 80px 上下，60px 左右 |
| 每页文字量 | ≤ 120 字 | ≤ 80 字 |
| 图片占比 | 30–60% 画面 | 40–70% 画面 |
| 主题风格 | 科技深色 / 简约白 / 人文暖色（三选一）| 同左 |

**⚠️ 人工审核点**：快速浏览导出的幻灯片图片序列，确认排版效果后进入 Audio 阶段。

**输出**：
- `projects/{slug}/slides/slide-01.png` … `slide-NN.png`

---

### Stage 4：Audio — AI 口播生成

**目标**：为每张幻灯片生成对应的口播音频。

与方案一基本相同，差异是：**每张幻灯片对应一个独立 MP3 文件**（而不是每个场景）：

```typescript
// generate-audio.ts
import { slides } from "./script.json";

for (const slide of slides) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: slide.narration,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
        },
      }),
    }
  );

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(`projects/${slug}/audio/${slide.id}.mp3`, audioBuffer);
}
```

**获取音频时长**（用于 Stage 5 合成）：

```typescript
import { getAudioDurationInSeconds } from "get-audio-duration";

const durations: Record<string, number> = {};
for (const slide of slides) {
  durations[slide.id] = await getAudioDurationInSeconds(
    `projects/${slug}/audio/${slide.id}.mp3`
  );
}
// 写入元数据
writeFileSync(`projects/${slug}/audio-metadata.json`, JSON.stringify(durations));
```

**配置项**：
- 语言：中文 zh-CN
- 语速：1.1x（偏自然，不过度压缩）
- 音色：可配置（默认：温和亲切型）

**输出**：
- `projects/{slug}/audio/slide-XX.mp3`
- `projects/{slug}/audio-metadata.json`

---

### Stage 5：合成输出 — FFmpeg 图片序列 → 视频

**目标**：将幻灯片图片 + 口播音频用 FFmpeg 精确合成为最终视频。

#### 5.1 单张幻灯片合成（图片 + 音频 → 视频片段）

```bash
# 每张幻灯片单独生成一个视频片段
ffmpeg -loop 1 -i projects/{slug}/slides/slide-01.png \
       -i projects/{slug}/audio/slide-01.mp3 \
       -c:v libx264 -tune stillimage \
       -c:a aac -b:a 192k \
       -shortest \
       tmp/{slug}/clip-01.mp4
```

#### 5.2 拼接所有片段

```bash
# 生成片段列表文件 concat.txt
echo "file 'tmp/{slug}/clip-01.mp4'" >> concat.txt
echo "file 'tmp/{slug}/clip-02.mp4'" >> concat.txt
# ...

# 拼接为最终视频
ffmpeg -f concat -safe 0 -i concat.txt \
       -c copy \
       out/{slug}-landscape.mp4
```

#### 5.3 批量自动化脚本（TypeScript）

```typescript
// render.ts
import { execSync } from "child_process";
import audioDurations from "./audio-metadata.json";
import slides from "./script.json";

// Step 1: 生成每张幻灯片的视频片段
for (const slide of slides.slides) {
  execSync(`ffmpeg -loop 1 \
    -i projects/${slug}/slides/${slide.id}.png \
    -i projects/${slug}/audio/${slide.id}.mp3 \
    -c:v libx264 -tune stillimage -pix_fmt yuv420p \
    -c:a aac -b:a 192k -shortest \
    -y tmp/${slug}/${slide.id}.mp4`);
}

// Step 2: 生成 concat.txt
const concatContent = slides.slides
  .map((s) => `file '../../tmp/${slug}/${s.id}.mp4'`)
  .join("\n");
writeFileSync(`tmp/${slug}/concat.txt`, concatContent);

// Step 3: 拼接
execSync(`ffmpeg -f concat -safe 0 \
  -i tmp/${slug}/concat.txt \
  -c copy -y out/${slug}-landscape.mp4`);
```

#### 5.4 竖屏版转换

```bash
# 基于横屏版裁剪/缩放为竖屏
ffmpeg -i out/{slug}-landscape.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:a copy \
  out/{slug}-portrait.mp4
```

**输出**：
- `out/{slug}-landscape.mp4` — 横屏版（B站/YouTube）
- `out/{slug}-portrait.mp4` — 竖屏版（抖音/视频号）

---

## 6. 技术架构

```
┌────────────────────────────────────────────────────┐
│              Article2Video 方案二                    │
│                                                    │
│  Stage 1 & 2（与方案一共用）                         │
│  内容提取 → 分页脚本 + 口播旁白                       │
│                    │                               │
│  ┌─────────────────▼──────────────────────────┐   │
│  │       Stage 3: Slide 生成引擎               │   │
│  │  Marp CLI  /  Puppeteer + HTML 模板         │   │
│  │  → 每页导出 PNG（1920×1080 或 1080×1920）   │   │
│  └─────────────────┬──────────────────────────┘   │
│                    │                               │
│  ┌─────────────────▼──────────────────────────┐   │
│  │       Stage 4: AI 口播生成                  │   │
│  │  ElevenLabs / MiniMax TTS                  │   │
│  │  → 每页独立 MP3 + 时长元数据               │   │
│  └─────────────────┬──────────────────────────┘   │
│                    │                               │
│  ┌─────────────────▼──────────────────────────┐   │
│  │       Stage 5: FFmpeg 合成                  │   │
│  │  图片 + 音频 → 片段 → 拼接 → MP4            │   │
│  └────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

### 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 幻灯片生成 | **Marp CLI** | Markdown → 图片，快速 |
| 高质量截图 | **Puppeteer** + HTML 模板 | 精细控制排版 |
| AI 配音 | **ElevenLabs** / MiniMax TTS | 多语言语音合成 |
| 视频合成 | **FFmpeg** | 图片序列 + 音频 → MP4 |
| 运行时 | Node.js + TypeScript | Skill 执行环境 |
| 内容提取 | Fetch + HTML Parser | 与方案一共用 |

---

## 7. 功能需求

### 7.1 必须实现（Must Have）

- [ ] 支持 URL / 本地文件输入（复用方案一 Stage 1）
- [ ] 自动生成分页脚本 + 口播旁白（复用方案一 Stage 2）
- [ ] Marp 生成幻灯片图片（横屏版）
- [ ] 至少 2 套内置视觉主题（深色/浅色）
- [ ] ElevenLabs TTS 口播生成
- [ ] FFmpeg 合成最终横屏 MP4
- [ ] 脚本分页审核确认节点
- [ ] 幻灯片图片预览确认节点

### 7.2 应当实现（Should Have）

- [ ] 竖屏版输出（9:16）
- [ ] Puppeteer 高质量截图引擎（可选模式）
- [ ] 3 套以上主题（科技/人文/商业）
- [ ] 幻灯片间添加简单过渡动效（FFmpeg 滤镜）
- [ ] 背景音乐混合（FFmpeg `amix` 滤镜）

### 7.3 将来实现（Could Have）

- [ ] Gamma API 集成（最高质量 AI 排版）
- [ ] 自定义字体和品牌色
- [ ] 字幕烧录进视频（FFmpeg `subtitles` 滤镜）
- [ ] 批量处理多篇文章
- [ ] 视频发布集成

---

## 8. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | 单篇文章（10 张幻灯片）全流程 ≤ 30 分钟 |
| 可靠性 | FFmpeg 合成失败自动重试；TTS 失败重试 3 次 |
| 可维护性 | 幻灯片主题通过 CSS/Marp 主题文件管理 |
| 安全性 | API Key 通过 `.env` 管理，不硬编码 |
| 兼容性 | macOS / Linux，需预装 FFmpeg |
| 扩展性 | 新增页面类型（模板）无需修改核心逻辑 |

---

## 9. 用户交互流程

```
用户: /article2video --plan=slide https://mp.weixin.qq.com/s/xxxxx

↓ Stage 1: Init
Skill: ✅ 已提取文章内容，共 2100 字，发现 8 张图片

↓ Stage 2: Plan
Skill: 📋 规划为 12 页幻灯片（封面1 + 内容10 + 结尾1）
       预计口播总时长约 5 分 20 秒
Skill: 请确认分页方案，输入 'ok' 继续或告知调整

用户: ok

↓ Stage 3: Slide 生成
Skill: 🎨 正在生成幻灯片图片（主题：科技深色）...
Skill: ✅ 已生成 12 张幻灯片，请查看 projects/article-slug/slides/ 确认后回复 'ok'

用户: ok，第3页标题改短一点

Skill: 🎨 重新生成第 3 页...
Skill: ✅ 已更新，请确认

用户: ok

↓ Stage 4: Audio
Skill: 🎙️ 正在生成 AI 口播（12 段）...
Skill: ✅ 口播生成完成，总时长 5 分 14 秒

↓ Stage 5: 合成输出
Skill: 🎬 正在合成视频（FFmpeg）...
Skill: ✅ 合成完成！
      📁 横屏版: out/article-slug-landscape.mp4 (5:14, 1920×1080)
      📁 竖屏版: out/article-slug-portrait.mp4 (5:14, 1080×1920)
```

---

## 10. 与方案一的选用决策树

```
文章是否以文字内容为主？
├── 是 → 图片较少（< 3 张）→ 优先选 方案一（Remotion）
│         追求动画感/逐步揭示效果 → 强烈推荐方案一
└── 否 → 含大量图片/信息图/截图 → 选 方案二（PPT/Slide）
          需要快速出稿（< 30 分钟）→ 强烈推荐方案二
          图文并茂、知识卡片风格 → 强烈推荐方案二
```

---

## 11. 目录结构

```
article2video/
├── PRD方案一#Remotion.md           # 方案一文档
├── PRD方案二#PPTSlide.md           # 本文档
├── scripts/
│   ├── init.ts                    # Stage 1（两方案共用）
│   ├── plan.ts                    # Stage 2（两方案共用）
│   ├── generate-slides-marp.ts    # Stage 3: Marp 生成幻灯片
│   ├── generate-slides-puppet.ts  # Stage 3: Puppeteer 高质量截图
│   ├── generate-audio.ts          # Stage 4: TTS 口播
│   └── render-ffmpeg.ts           # Stage 5: FFmpeg 合成
├── templates/
│   ├── themes/
│   │   ├── tech-dark.css          # 科技深色主题（Marp）
│   │   ├── minimal-light.css      # 简约白主题
│   │   └── warm-human.css         # 人文暖色主题
│   └── html/
│       ├── cover.html             # 封面页 HTML 模板
│       ├── point.html             # 观点页模板
│       ├── image.html             # 图片页模板
│       ├── list.html              # 列表页模板
│       ├── quote.html             # 引用页模板
│       └── outro.html             # 结尾页模板
├── projects/                      # 每个项目的独立工作目录
│   └── {slug}/
│       ├── content.json           # 提取的文章内容
│       ├── script.json            # 分页脚本 + 口播旁白
│       ├── audio-metadata.json    # 音频时长元数据
│       ├── slides/                # 幻灯片图片
│       └── assets/                # 本地化原文图片
├── tmp/                           # 临时视频片段（合成后清理）
│   └── {slug}/
│       ├── slide-01.mp4
│       └── concat.txt
└── out/                           # 最终输出
    ├── {slug}-landscape.mp4
    └── {slug}-portrait.mp4
```

---

## 12. 依赖与环境配置

```bash
# 系统依赖
brew install ffmpeg

# Node.js 依赖
npm install @marp-team/marp-cli puppeteer get-audio-duration

# 环境变量（.env）
ELEVENLABS_API_KEY=your_key_here
# 或
MINIMAX_API_KEY=your_key_here
MINIMAX_GROUP_ID=your_group_id_here
```

---

> **注意**：Stage 1（内容提取）和 Stage 2（脚本规划）与方案一完全共用，建议封装为独立模块，通过 `--plan=remotion` 或 `--plan=slide` 参数切换后续不同的生成路线。

> **提示**：FFmpeg 的 `-tune stillimage` 参数专门针对静态图片转视频做了优化，相比普通编码速度提升 2–3 倍，务必加上。
