---
name: english-wordcard
description: "Generate beautiful English vocabulary learning cards (英语单词信息图卡片) based on movie/anime/TV show themes. Supports multiple visual styles including watercolor (水彩手绘), 3D clay (3D软陶), crayon doodle (蜡笔涂鸦), and anime styles. Use when the user wants to create English vocabulary cards for a specific movie or anime, generate word learning images based on a TV show theme, select a visual style for vocabulary card generation, or add new visual styles to the card generator."
---

# English Wordcard Skill

Generate themed English vocabulary learning cards as AI image prompts, based on a movie/anime/TV show. Each card features characters from the work, multi-scene panoramic layout, and 8–12 vocabulary words with Chinese translations and phonetic index.

## Visual Style System

Styles are defined in `references/styles-registry.md` (style list + how to add new styles).
Each style has its own detail file at `references/styles/<style-id>.md`.

**Read `references/styles-registry.md` first** to get the available style list before presenting options to the user.

### Style Selection Flow

1. Show the user the available style list (from styles-registry.md table)
2. If the user has already specified a style → load that style file directly
3. If no style specified → ask the user to pick one before proceeding

---

## Workflow

### Step 1 — Confirm Work & Style

Ask the user:
1. Which movie / anime / TV show is the card themed around?  
2. Which visual style do they prefer? (present the table from styles-registry.md)

If both are already clear from context, skip directly to Step 2.

### Step 2 — Ask for Vocabulary Source

Ask the user:
> "请提供你想教学的英文段落或单词列表。如果没有，请直接回复「没有」，我将根据《作品名》的核心主题智能生成 8–12 个英语单词。"

### Step 3 — Analyze Work & Plan Layout

Based on the chosen work, determine:

- **角色配置** — Select core characters (any number)
- **场景组合** — At least 5 interconnected scenes from the work's world, e.g.:
  - 室内流动：客厅→厨房→餐厅→花园→阳台
  - 校园漫步：教室→走廊→图书馆→天台→操场
  - 自然过渡：森林→溪边→石桥→花田→山坡
  - 奇幻旅程：魔法塔→廊桥→庭院→湖畔→秘境
  - 海底漫游：珊瑚丛→沉船→贝壳屋→海草地→洞穴
  - 东方意境：庭院→回廊→茶室→荷塘→竹林
  - 温馨日常：咖啡馆→书店→公园→湖边→野餐地
  - Or any unique scene combination suited to the work's universe
- **场景过渡** — Use natural elements (light/shadow, plants, ground texture transitions) for seamless flow; no scene numbers or dividers
- **单词融入** — Match vocabulary to fitting scene areas based on word meaning
- **互动动作** — Characters naturally interact across different scene areas
- **场景元素** — Word carriers vary by scene (blackboard / book / sticky note / poster / speech bubble / bottle / hanging picture / table sign / wooden sign / stone tablet, etc.)

### Step 4 — Generate the Full Image Prompt

Load `references/styles/<selected-style-id>.md` to get the style-specific rendering block.

Then output the complete image generation prompt using this structure:

```
[画面渲染指令 from style file]

画面中包含《{{作品名称}}》{{角色数量}}位角色：{{角色中文名列表}}。

[角色呈现方式 from style file, with {{互动动作描述}} filled in]

注意：角色英文名不出现在画面中。

【单词呈现要求】
画面中共出现 8-12 个英文生词，根据单词含义智能融入最适合的场景区域，以{{场景元素}}等形式自然呈现。所有英文单词必须全部为小写。
重要：
① 每个英文单词旁边必须附带对应的中文翻译（无音标），形成「英文+中文」配对展示，单词与翻译之间不要有分隔符
② 单词字体要清晰醒目、足够大，确保在画面中易于阅读识别

【单词内容】
{{用户提供段落/单词：提取核心词汇，根据词义匹配场景}}
{{用户回复"没有"：根据作品主题智能生成}}

【词汇表区域 · 最重要】
画面最下方设整洁的词汇表区域，格式为：
英文单词  /音标/  中文翻译
（仅词汇表包含音标）
数量、拼写、顺序必须与上方完全一致、一一对应、不增不减。

【视觉风格】
[视觉风格描述 from style file]
```

### Step 5 — Deliver Output

Present the completed prompt to the user for use in their AI image generation tool.  
Ask if they want to adjust the style, swap words, or generate another card with a different theme.

---

## Adding New Styles

To add a new visual style, see `references/styles-registry.md` for the template and steps.
No changes to SKILL.md are needed — just add the new style file and register it in the table.
