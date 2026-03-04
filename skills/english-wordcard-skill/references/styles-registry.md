# English Wordcard — Style Registry

This file is the single source of truth for all available visual styles.
To add a new style, create a new `.md` file in this directory and add an entry here.

## Available Styles

| Style ID       | Display Name     | File                  | Best For                          |
|----------------|------------------|-----------------------|-----------------------------------|
| `watercolor`   | 水彩手绘风格     | styles/watercolor.md  | 文艺作品、自然题材、温馨日常       |
| `clay-3d`      | 3D软陶风格       | styles/clay-3d.md     | 动漫、儿童向、可爱角色             |
| `crayon-doodle`| 蜡笔涂鸦风格     | styles/crayon-doodle.md | 低龄儿童、充满活力的题材          |
| `pikachu-anime`| 皮卡丘动画风格   | styles/pikachu-anime.md | 宝可梦IP、卡通动漫                |

## How to Add a New Style

1. Create `styles/<style-id>.md` following the template below
2. Add a row to the table above

### Style File Template

```markdown
# Style: <Display Name>

## Style ID
`<style-id>`

## 画面渲染指令（第三步·生成提示词时替换 {{STYLE_BLOCK}}）

生成一张 3:4 的<风格名称>英语教学信息图。
整体由至少5个场景无缝串联...（描述画面整体呈现方式与质感）

## 视觉风格描述（用于提示词末尾 【视觉风格】 区域）

<1-2句话描述视觉质感、色彩、笔触等核心特征>

## 角色呈现方式

角色们以<风格对应的呈现形式>，分布在不同场景区域自然互动...
```
