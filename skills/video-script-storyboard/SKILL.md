---
name: video-script-storyboard
description: Generate complete video production packages including hooks, voiceover scripts, storyboard shot lists, on-screen text overlays, and thumbnail prompts. Use when users need to create short-form or long-form video content plans, generate AI video/image generation prompts for each shot, or produce structured storyboards for video production. Triggers on requests like "generate a video script", "create a storyboard", "plan a short video about X", or any video content creation task.
---

# Video Script + Storyboard

Generate complete video production packages: hooks, scripts, storyboard shot lists, on-screen text, and thumbnail prompts — with AI-ready prompts for each shot.

## Workflow

This skill follows a 5-step sequential workflow:

1. **Gather topic** — Obtain the video subject/story from the user
2. **Confirm parameters** — Clarify key production parameters
3. **Generate content** — Produce the full video package
4. **User review & refine** — Iterate based on feedback
5. **Final output** — Export as Markdown document to `assets/`

## Step 1: Gather Topic

Ask the user for their video topic/story content. Accept any of:
- A simple topic (e.g., "Pikachu vs Bulbasaur")
- A story concept or narrative outline
- A product/brand to feature
- Reference URLs or images for inspiration

## Step 2: Confirm Parameters

Confirm the following parameters through conversation. Skip any the user has already specified. Use defaults for unspecified optional parameters.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `topic` | ✅ | — | 视频主题/故事内容 |
| `targetAudience` | ✅ | — | 目标受众 |
| `durationSeconds` | ❌ | 8s | 单段视频最大时长 |
| `resolution` | ❌ | 2K | 分辨率 |
| `aspect_ratio` | ❌ | 竖屏 9:16 | 尺寸画幅比 (竖屏/横屏 + 比例) |
| `tone` | ❌ | — | 音调描述 (活力/温暖/悬疑等) |
| `style` | ❌ | — | 视觉风格 (see [references/video-styles.md](references/video-styles.md)) |
| `roles` | ❌ | — | 多角色描述 (照片/图片/文本描述) |

**角色一致性**：When roles are specified, generate detailed character appearance descriptions to ensure visual consistency across all shots and segments.

**风格选择**：If the user is unsure about style, consult [references/video-styles.md](references/video-styles.md) to suggest appropriate options based on their content type.

## Step 3: Generate Content

Generate the full video package. For each video segment, produce four content blocks:

### 3.1 Thumbnail Prompt (缩略图提示词)
- AI image generation prompt for the video cover/thumbnail
- Write in **English** for maximum AI tool compatibility
- Include composition, style, elements, and mood

### 3.2 Voiceover Script (旁白脚本)
- Spoken narration / voiceover content
- Match the specified tone and target audience
- Include hooks in the opening to grab attention

### 3.3 Shot List (分镜镜头表)
For each shot, specify:
- **Time range** (e.g., 00-03s)
- **Shot type** — Reference [references/shot-types.md](references/shot-types.md) for shot sizes
- **Camera movement** — Reference [references/shot-types.md](references/shot-types.md) for movement types
- **Scene description** — Reference [references/scene-types.md](references/scene-types.md) for scene vocabulary
- **Audio/SFX** — Sound effects and music cues
- **AI Prompt** — English prompt for AI video/image generation tools

**Shot timing rules:**
- Each shot ≤ `durationSeconds` parameter
- Total duration should match `durationTotal`
- Use transitions from [references/shot-types.md](references/shot-types.md)

### 3.4 On-screen Text (屏幕文字)
- Timestamped text overlays (subtitles, titles, CTA)
- Include emoji and visual indicators where appropriate
- Final frame should include CTA (Subscribe, Like, Comment, etc.)

### Output Format
Follow the template structure in [templates/output-template.md](templates/output-template.md).

## Step 4: User Review & Refine

Present the generated content and invite the user to request adjustments:
- Modify shot content for specific time ranges
- Change style, tone, or camera angles
- Add/remove/edit voiceover lines or sound effects
- Adjust timing or segment structure
- Regenerate thumbnail prompts

Iterate until the user is satisfied.

## Step 5: Final Output

Export the final approved content as a Markdown document:
- Follow the Markdown template in [templates/output-template.md](templates/output-template.md)
- Save to `assets/[topic-slug]-storyboard.md`
- Confirm the output path with the user

## References

- **[references/shot-types.md](references/shot-types.md)** — Shot sizes, camera movements, transitions
- **[references/video-styles.md](references/video-styles.md)** — Visual styles, color tones, pacing guides
- **[references/scene-types.md](references/scene-types.md)** — Scene categories and description vocabulary
- **[templates/output-template.md](templates/output-template.md)** — Output format template (JSON + Markdown)
