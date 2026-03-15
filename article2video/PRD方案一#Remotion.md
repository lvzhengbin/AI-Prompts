# 📄 PRD：Article2Video — 一键将网络/本地文章变成视频

> **文档版本**：v0.2  
> **创建日期**：2026-03-15  
> **参考文章**：[Skill 创作手记：Remotion如何把文章一键变成视频](https://mp.weixin.qq.com/s/Do77XbArglvEZyVAw51r5A)  
> **Remotion 开源项目**：[github.com/remotion-dev/remotion](https://github.com/remotion-dev/remotion)  
> **所用技能**：`remotion` skill（React 视频框架）+ AI TTS

---

## 1. 背景与动机

### 1.1 痛点

| 痛点 | 说明 |
|------|------|
| 手工制作视频耗时 | 录制、剪辑、对字幕、加背景音乐……一篇文章变视频动辄 4–6 小时 |
| 工具门槛高 | PR/AE 专业门槛高；简单工具效果差、缺乏个性化 |
| 图文与视频割裂 | 图文和视频通常单独制作，难以实现同步发布 |
| 缺乏可复用流程 | 每次制作都从头开始，无法标准化、批量化 |

### 1.2 机会

借助 **Remotion**（基于 React 的程序化视频框架）和 **AI TTS**（文字转语音）技术，将"文章→视频"的全链路流程封装为一个可复用的 **Skill（技能）**，实现：

- ✅ 输入一篇文章（URL 或本地 Markdown/TXT）
- ✅ 全自动生成专业品质的视频
- ✅ 人工干预仅限于关键节点的审核确认

---

## 2. 目标

### 2.1 产品目标

1. **一键启动**：用户提供文章来源（URL 或本地路径），Skill 自动完成后续所有步骤。
2. **端到端自动化**：覆盖内容提取 → 脚本生成 → 视频布局 → 配音生成 → 时间轴同步 → 渲染输出。
3. **高度可复用**：统一视觉风格模板，支持多篇文章批量生成。
4. **质量可控**：在关键节点（脚本审核、视觉预览）提供人工介入点。

### 2.2 成功指标

| 指标 | 目标值 |
|------|--------|
| 全流程耗时 | ≤ 60 分钟（含 TTS 生成和渲染） |
| 人工操作步骤 | ≤ 3 次确认操作 |
| 视频输出格式 | 支持横屏 16:9 / 竖屏 9:16 双版本 |
| 平均渲染成功率 | ≥ 95% |

---

## 3. 用户故事

```
作为一名内容创作者，
我希望输入一篇微信公众号文章链接或本地 Markdown 文件，
能够自动生成配有 AI 配音、字幕和视觉动画的短视频，
以便我可以同步在抖音、B站等平台发布，扩大内容触达。
```

### 细化场景

| 场景 | 描述 |
|------|------|
| 网络文章 | 输入 URL（微信/网页），自动抓取正文和图片 |
| 本地文章 | 输入本地 `.md` / `.txt` 文件路径 |
| 批量生成 | 输入文章列表，批量生成多个视频 |
| 风格自定义 | 选择预设主题（科技/人文/商业），或使用自定义模板 |

---

## 4. 核心工作流（6 阶段流水线）

```
[用户输入] → Stage 1: Init → Stage 2: Plan → Stage 3: Dev → Stage 4: Audio → Stage 5: Sync → Stage 6: Output → [视频文件]
```

### Stage 1：Init — 初始化与内容提取

**目标**：获取文章原始内容，整理素材。

**输入**：
- 文章 URL（支持微信公众号、普通网页）
- 或本地文件路径（`.md` / `.txt`）

**处理步骤**：
1. 若为 URL：调用 web 抓取工具提取正文、标题、图片
2. 若为本地文件：读取文件内容，提取图片引用
3. 创建项目目录（环境隔离）：`projects/{slug}/`
   - `assets/` — 图片等素材
   - `audio/` — TTS 音频文件
   - `public/` — Remotion 静态资源
4. 下载并本地化所有图片资源

**输出**：
- `projects/{slug}/content.json` — 结构化文章内容
- `projects/{slug}/assets/` — 本地化图片

---

### Stage 2：Plan — 内容规划与脚本生成

**目标**：将文章内容转化为视频分镜脚本，估算时长。

**处理步骤**：
1. **内容分段**：将文章拆分为若干「场景（Scene）」，每个场景对应一个视频片段
2. **逐字稿生成**：为每个场景生成适合朗读的旁白文本（精简原文，保留核心信息）
3. **时长估算**：按平均语速（中文 ~200字/分钟）估算每场景时长
4. **配图规划**：为每个场景分配 1–3 张配图（防止视觉疲劳）
5. **⚠️ 人工审核点**：输出脚本预览，等待用户确认或修改

**输出**：
- `projects/{slug}/script.json` — 分场景脚本
  ```json
  {
    "title": "文章标题",
    "scenes": [
      {
        "id": "scene-01",
        "narration": "旁白文本...",
        "images": ["assets/img1.jpg"],
        "estimatedDuration": 8.5
      }
    ]
  }
  ```

---

### Stage 3：Dev — 视频视觉开发

**目标**：使用 Remotion 定义视频布局和动画组件。

#### 3.1 Composition 定义（`src/Root.tsx`）

在 `Root.tsx` 中声明横屏 + 竖屏两个 Composition，均挂载 `calculateMetadata` 以便 Stage 5 动态注入实际音频时长：

```tsx
import { Composition } from "remotion";
import { ArticleVideo, ArticleVideoProps } from "./compositions/Article";
import { calculateMetadata } from "./calculateMetadata";

export const RemotionRoot = () => (
  <>
    {/* 横屏版 16:9 */}
    <Composition
      id="ArticleLandscape"
      component={ArticleVideo}
      durationInFrames={900}  // 占位，calculateMetadata 会覆盖
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ slug: "my-article", sceneDurations: [] } satisfies ArticleVideoProps}
      calculateMetadata={calculateMetadata}
    />
    {/* 竖屏版 9:16 */}
    <Composition
      id="ArticlePortrait"
      component={ArticleVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ slug: "my-article", sceneDurations: [] } satisfies ArticleVideoProps}
      calculateMetadata={calculateMetadata}
    />
  </>
);
```

> **关键规则**：用 `type` 而非 `interface` 声明 Props，保证 `defaultProps` 类型安全。

#### 3.2 场景编排：Series + Sequence（`src/compositions/Article.tsx`）

用 `<Series>` 让场景**严格顺序播放**，每个 `<Series.Sequence>` 的 `durationInFrames` 由 Stage 5 传入的 `sceneDurations` 数组驱动：

```tsx
import { AbsoluteFill } from "remotion";
import { Series } from "remotion";

export const ArticleVideo = ({ sceneDurations, scenes }: ArticleVideoProps) => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={sceneDurations[0]}>
          <TitleScene title={scenes[0].title} />
        </Series.Sequence>

        {scenes.slice(1, -1).map((scene, i) => (
          <Series.Sequence key={scene.id} durationInFrames={sceneDurations[i + 1]}>
            <ContentScene scene={scene} />
          </Series.Sequence>
        ))}

        <Series.Sequence durationInFrames={sceneDurations[sceneDurations.length - 1]}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

> **防坑**：`<Series>` 内部不能直接嵌套条件语句，用 `.map()` 生成子序列。子组件内 `useCurrentFrame()` 返回的是**局部帧号**（从 0 开始），不是全局帧号。

#### 3.3 转场效果（`@remotion/transitions`）

如需场景间动效，用 `<TransitionSeries>`（替代 `<Series>`），并在相邻场景之间插入 `<TransitionSeries.Transition>`：

```bash
npx remotion add @remotion/transitions
```

```tsx
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={sceneDurations[0]}>
    <TitleScene />
  </TransitionSeries.Sequence>

  {/* 淡入淡出转场，时长 15 帧 */}
  <TransitionSeries.Transition
    presentation={fade()}
    timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
  />

  <TransitionSeries.Sequence durationInFrames={sceneDurations[1]}>
    <ContentScene />
  </TransitionSeries.Sequence>

  {/* 侧滑转场 */}
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-right" })}
    timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
  />

  <TransitionSeries.Sequence durationInFrames={sceneDurations[2]}>
    <OutroScene />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

> ⚠️ **时长计算注意**：`TransitionSeries` 的转场会**缩短**总时长（两段场景共用转场帧），需在 `calculateMetadata` 中减去转场帧数：
> ```ts
> totalFrames = sum(sceneDurations) - sum(transitionDurations)
> ```

**可用转场类型**：

| 转场 | import 路径 | 说明 |
|------|------------|------|
| `fade()` | `@remotion/transitions/fade` | 淡入淡出 |
| `slide()` | `@remotion/transitions/slide` | 侧滑（四方向） |
| `wipe()` | `@remotion/transitions/wipe` | 划入 |
| `flip()` | `@remotion/transitions/flip` | 翻转 |
| `clockWipe()` | `@remotion/transitions/clock-wipe` | 时钟划入 |

#### 3.4 动画系统：interpolate + spring

> ⚠️ **严禁使用 CSS `transition` / CSS `animation` / Tailwind 动画类**，它们在渲染时不生效。所有动效**必须**基于 `useCurrentFrame()` 驱动。

**淡入（Fade In）**：
```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
  extrapolateRight: "clamp",
});
```

**弹性入场（Spring）**：
```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const scale = spring({
  frame,
  fps,
  config: { damping: 200 },      // 无回弹，平滑入场
  durationInFrames: 20,
});
// 常用 spring 配置：
// { damping: 200 }               → 平滑无回弹（标题、文字）
// { damping: 20, stiffness: 200 } → 快弹少弹（UI 元素）
// { damping: 8 }                 → 弹性强（图标入场）
```

**入场 + 出场组合（Scale In / Out）**：
```tsx
const { durationInFrames } = useVideoConfig();

const inAnim  = spring({ frame, fps, config: { damping: 200 } });
const outAnim = spring({ frame, fps, durationInFrames: fps, delay: durationInFrames - fps });

const scale = inAnim - outAnim;  // 进入后缩小退出
```

**Easing（缓动曲线）**：
```tsx
import { interpolate, Easing } from "remotion";

// 缓入缓出（最常用）
const y = interpolate(frame, [0, fps], [50, 0], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

#### 3.5 文字动效

- **打字机效果**：用字符串切片 `text.slice(0, charsToShow)` 逐字显示，**禁止**用逐字符 opacity
- **单词高亮**：逐词遍历，通过 `spring()` 计算高亮背景宽度

#### 3.6 视觉设计规范

| 规范项 | 值 |
|--------|----|
| FPS | 30（标准） |
| 横屏分辨率 | 1920 × 1080 |
| 竖屏分辨率 | 1080 × 1920 |
| 顶部安全边距 | 10%（防遮挡） |
| 字幕区域 | 底部 20% 固定区 |
| 每场景最多配图 | 3 张 |
| 场景入场动画时长 | 0.5s（15 帧） |
| 场景转场时长 | 0.5–1s（15–30 帧） |

**⚠️ 人工审核点**：执行 `npx remotion studio` 启动可视化预览，在浏览器中逐帧检查效果，确认后告知 Skill 继续进入 Audio 阶段。

**输出**：
- Remotion 项目代码（`src/` 目录）
- `npx remotion studio` 可预览的完整视频草稿

---

### Stage 4：Audio — AI 配音生成

**目标**：为每个场景生成高质量 AI 语音。

**技术实现**：

使用 **ElevenLabs TTS API**（Remotion skill 官方支持）或 **MiniMax TTS**（文章推荐，中文效果更佳）：

```typescript
// generate-voiceover.ts
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: scene.narration,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  }
);
// 保存到 public/audio/{sceneId}.mp3
```

**处理步骤**：
1. 读取 `script.json` 中每个场景的旁白文本
2. 逐场景调用 TTS API 生成 MP3
3. 保存至 `public/audio/{slug}/{sceneId}.mp3`
4. 记录每个音频的实际时长（用于 Stage 5 对齐）

**配置项**：
- 语言：中文（zh-CN）
- 语速：1.2x（更有节奏感）
- 音色：可配置（默认：新闻播音风格）

**输出**：
- `public/audio/{slug}/scene-XX.mp3` — 各场景音频文件
- `projects/{slug}/audio-metadata.json` — 音频时长元数据

---

### Stage 5：Sync — 时间轴同步

**目标**：将实际音频时长精确映射到视频时间轴。

**技术实现**（使用 Remotion `calculateMetadata`）：

```typescript
export const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const durations = await Promise.all(
    SCENE_AUDIO_FILES.map((file) => getAudioDuration(staticFile(file)))
  );

  const FPS = 30;
  const sceneDurations = durations.map((d) => Math.ceil(d * FPS));
  const totalFrames = sceneDurations.reduce((sum, d) => sum + d, 0);

  return {
    durationInFrames: totalFrames,
    props: { ...props, sceneDurations },
  };
};
```

**处理步骤**：
1. 读取所有场景音频的实际时长
2. 通过 `calculateMetadata` 动态重设每个 `<Sequence>` 的 `durationInFrames`
3. 重新预览验证音画同步效果

**输出**：
- 更新后的 Remotion Composition（时长已与音频精确对齐）

---

### Stage 6：Output — 渲染输出

**目标**：批量渲染生成最终视频文件。

**处理步骤**：
1. **横屏版**（16:9, 1920×1080）：
   ```bash
   npx remotion render src/index.ts MyComp out/{slug}-landscape.mp4
   ```
2. **竖屏版**（9:16, 1080×1920）：
   ```bash
   npx remotion render src/index.ts MyCompVertical out/{slug}-portrait.mp4
   ```
3. 输出视频质量检查（时长、分辨率、音频轨道验证）

**输出**：
- `out/{slug}-landscape.mp4` — 横屏版（适合 B站、YouTube）
- `out/{slug}-portrait.mp4` — 竖屏版（适合抖音、微信视频号）

---

## 5. 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                     Article2Video Skill                  │
│                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────────┐ │
│  │  抓取器  │   │  AI规划  │   │   Remotion 视频引擎  │ │
│  │ (Fetch/  │   │  (LLM脚  │   │  (React组件 + 动画)  │ │
│  │  Scrape) │   │  本生成) │   │                      │ │
│  └────┬─────┘   └────┬─────┘   └──────────┬───────────┘ │
│       │              │                     │             │
│  ┌────▼─────────────▼─────────────────────▼───────────┐ │
│  │           项目目录 projects/{slug}/                  │ │
│  │  content.json | script.json | audio/ | public/      │ │
│  └─────────────────────────────────────┬───────────────┘ │
│                                        │                 │
│  ┌─────────────────────────────────────▼───────────────┐ │
│  │         AI TTS (ElevenLabs / MiniMax)                │ │
│  │              生成场景配音 MP3                         │ │
│  └─────────────────────────────────────┬───────────────┘ │
│                                        │                 │
│  ┌─────────────────────────────────────▼───────────────┐ │
│  │         Remotion Render (Node.js / Chrome)           │ │
│  │         输出 MP4（横屏 + 竖屏）                      │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 5.1 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 视频框架 | **Remotion** | React-based 程序化视频生成 |
| 运行时 | **Node.js** + TypeScript | Skill 执行环境 |
| AI 配音 | **ElevenLabs** / MiniMax TTS | 多语言高质量语音合成 |
| 内容抓取 | Fetch API + HTML Parser | 网络文章提取 |
| 脚本生成 | LLM（Claude/GPT） | 文章→分镜脚本转化 |
| 渲染 | Remotion CLI + Chromium | 视频渲染引擎 |
| 存储 | 本地文件系统 | 项目隔离存储 |

---

## 6. 功能需求

### 6.1 必须实现（Must Have）

- [ ] 支持 URL 输入（自动抓取正文和图片）
- [ ] 支持本地 Markdown/TXT 文件输入
- [ ] 自动生成分场景逐字稿（以中文为主）
- [ ] AI TTS 配音生成（ElevenLabs 或 MiniMax）
- [ ] Remotion 组件化视频布局
- [ ] 音画时间轴自动同步（`calculateMetadata`）
- [ ] 输出横屏 MP4（16:9）
- [ ] 环境隔离（每个项目独立目录）
- [ ] 脚本审核人工确认节点

### 6.2 应当实现（Should Have）

- [ ] 输出竖屏 MP4（9:16）
- [ ] 多视觉主题支持（科技/人文/商业）
- [ ] 自动字幕生成（使用 Remotion subtitles 规则）
- [ ] 语速和音色可配置
- [ ] 批量处理多篇文章

### 6.3 将来实现（Could Have）

- [ ] 背景音乐自动混合（Remotion audio 规则）
- [ ] 数据可视化场景（Remotion charts 规则）
- [ ] 3D 动画效果（Remotion 3D 规则）
- [ ] 视频发布集成（自动上传到抖音/B站）
- [ ] Web 界面（可视化操作面板）

---

## 7. 非功能需求

| 类别 | 要求 |
|------|------|
| 性能 | 单篇文章（1500字）全流程 ≤ 60 分钟 |
| 可靠性 | TTS 生成失败自动重试 3 次 |
| 可维护性 | 视觉组件模块化，主题通过配置文件切换 |
| 安全性 | API Key 通过 `.env` 文件管理，不硬编码 |
| 兼容性 | 支持 macOS / Linux 环境 |
| 扩展性 | 新增视觉主题无需修改核心代码 |

---

## 8. 关键设计原则（来自文章经验）

### 8.1 防坑清单

| 问题 | 解决方案 |
|------|----------|
| 音频重叠（多段音频时序混乱） | 使用 Remotion `<Sequence>` 严格隔离每段音频时间轴 |
| 素材目录混乱 | 每个项目独立目录，`public/` 与 `assets/` 严格分离 |
| 时长不匹配（估算 vs 实际 TTS） | 用 `calculateMetadata` 读取实际音频时长动态计算帧数 |
| 视觉疲劳 | 每场景图片 ≤ 3 张，顶部保留 10% 留白 |

### 8.2 核心工作原则

1. **流程优先于代码**：先设计清晰的工作流，再开始实现
2. **两轮脚本校验**：开始渲染前对旁白脚本进行两轮审核
3. **先布局后配音**：先完成视觉组件开发和预览，再生成最终音频
4. **环境严格隔离**：开发环境与资产目录绝对隔离

---

## 9. 实现阶段规划

### Phase 1：MVP（核心链路）
> 目标：跑通端到端流程

- Stage 1: Init（URL 抓取 + 本地文件读取）
- Stage 2: Plan（基础脚本生成，人工确认）
- Stage 3: Dev（基础 Remotion 模板）
- Stage 4: Audio（ElevenLabs TTS 集成）
- Stage 5: Sync（calculateMetadata 时间对齐）
- Stage 6: Output（横屏 MP4 输出）

**预估工期**：2–3 天

### Phase 2：质量提升
> 目标：提升视觉质量和用户体验

- 竖屏版输出
- 自动字幕（Remotion subtitles）
- 多主题视觉模板
- 背景音乐混合

**预估工期**：3–5 天

### Phase 3：规模化
> 目标：支持批量生产

- 批量文章处理
- 视频发布集成
- Web 操作界面

**预估工期**：1–2 周

---

## 10. 用户交互流程

```
用户: /article2video https://mp.weixin.qq.com/s/xxxxx

↓ Stage 1: Init
Skill: ✅ 已提取文章内容，共 1823 字，发现 5 张图片

↓ Stage 2: Plan  
Skill: 📋 生成脚本预览（6个场景，预估时长 4分32秒）
       [显示脚本摘要]
Skill: 请确认脚本，输入 'ok' 继续，或告知需要修改的地方

用户: ok

↓ Stage 3: Dev
Skill: 🎨 正在生成 Remotion 视频布局...
Skill: 💡 已启动预览服务器 http://localhost:3000，请查看效果后回复 'ok' 继续

用户: ok

↓ Stage 4: Audio
Skill: 🎙️ 正在生成 AI 配音（6个场景）...
Skill: ✅ 配音生成完成，总时长 4分18秒

↓ Stage 5: Sync
Skill: ⏱️ 正在同步时间轴...
Skill: ✅ 音画同步完成

↓ Stage 6: Output
Skill: 🎬 正在渲染视频...
Skill: ✅ 渲染完成！
      📁 横屏版: out/article-slug-landscape.mp4 (4:18, 1920x1080)
      📁 竖屏版: out/article-slug-portrait.mp4 (4:18, 1080x1920)
```

---

## 11. 目录结构

```
article2video/
├── PRD.md                          # 本文档
├── SKILL.md                        # Skill 主文件
├── scripts/
│   ├── init.ts                     # Stage 1: 内容提取
│   ├── plan.ts                     # Stage 2: 脚本规划
│   ├── generate-voiceover.ts       # Stage 4: TTS 配音生成
│   └── render.ts                   # Stage 6: 渲染输出
├── remotion/
│   ├── src/
│   │   ├── index.ts                # Remotion 入口
│   │   ├── compositions/
│   │   │   ├── Article.tsx         # 主 Composition
│   │   │   └── ArticleVertical.tsx # 竖屏版
│   │   └── components/
│   │       ├── TitleScene.tsx      # 标题场景
│   │       ├── ContentScene.tsx    # 内容场景
│   │       └── OutroScene.tsx      # 结尾场景
│   └── public/
│       └── audio/                  # TTS 音频（按项目 slug 隔离）
├── projects/                       # 每个项目的独立工作目录
│   └── {slug}/
│       ├── content.json            # 提取的文章内容
│       ├── script.json             # 分场景脚本
│       ├── audio-metadata.json     # 音频时长元数据
│       └── assets/                 # 本地化图片
└── out/                            # 最终输出视频
    ├── {slug}-landscape.mp4
    └── {slug}-portrait.mp4
```

---

## 12. 依赖与环境配置

```bash
# 安装依赖
npm install remotion @remotion/cli @remotion/player

# 环境变量（.env 文件）
ELEVENLABS_API_KEY=your_key_here
# 或
MINIMAX_API_KEY=your_key_here
MINIMAX_GROUP_ID=your_group_id_here
```

---

> **注意**：本 PRD 基于文章《Skill 创作手记：Remotion如何把文章一键变成视频》中的实战经验整理，结合 Remotion skill 的技术规范制定。实现过程中应优先参考 `skills/remotion/rules/` 目录下的各模块规则文档。

> **提示**：推荐实现顺序：先完成 Stage 3 的视觉布局开发并预览，再进行 Stage 4 的 TTS 生成。这样可以避免视觉布局与音频时长不匹配导致的返工。
