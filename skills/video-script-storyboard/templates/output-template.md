# Video Script & Storyboard 输出模板

## 格式说明

每个视频生成一组包含以下四个模块的内容：

### 完整输出结构

```json
{
  "video_info": {
    "topic": "视频主题",
    "targetAudience": "目标受众",
    "durationTotal": "总时长",
    "durationPerSegment": "单段最大时长",
    "resolution": "2K",
    "aspect_ratio": "竖屏 | 16:9",
    "tone": "音调描述",
    "style": "视觉风格",
    "roles": [
      {
        "name": "角色名称",
        "description": "角色外观描述 (确保一致性)",
        "reference": "参考图片路径或文本描述"
      }
    ]
  },

  "segments": [
    {
      "segment_id": 1,
      "thumbnail_prompt": {
        "title": "Thumbnail Concept",
        "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词",
        "content": "详细的画面构图、风格和元素描述 (英文 Prompt)"
      },
      "script": {
        "title": "Voiceover",
        "description": "旁白脚本 — 视频的口播/解说词内容",
        "content": "口播/解说词文本"
      },
      "shotlist": {
        "title": "Visual Plan",
        "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效",
        "shots": [
          {
            "time": "00-03s",
            "shot_type": "ECU (特写)",
            "camera_movement": "Push In",
            "description": "镜头画面内容描述",
            "audio": "音效/音乐描述",
            "ai_prompt": "AI 视频/图片生成提示词 (英文)"
          }
        ]
      },
      "onscreen_text": {
        "title": "Text Overlays",
        "description": "屏幕文字 — 视频中叠加显示的字幕/标题/引导文字",
        "items": [
          {
            "time": "00:00",
            "text": "显示文字内容",
            "style": "字体样式描述 (可选)"
          }
        ]
      }
    }
  ]
}
```

## Markdown 文档输出模板

最终输出为 Markdown 格式文档：

```markdown
# 🎬 [视频主题]

## 📋 视频信息

| 项目 | 内容 |
|------|------|
| 主题 | [topic] |
| 目标受众 | [targetAudience] |
| 总时长 | [durationTotal] |
| 单段时长 | [durationPerSegment] |
| 分辨率 | [resolution] |
| 画幅比 | [aspect_ratio] |
| 音调 | [tone] |
| 风格 | [style] |

### 角色设定
[角色描述表]

---

## 🎞️ Segment 1

### 🖼️ 缩略图提示词 (Thumbnail Prompt)
> [AI绘图提示词，英文]

### 🎙️ 旁白脚本 (Voiceover)
> [口播/解说词]

### 🎥 分镜镜头表 (Shot List)

| 时间 | 景别 | 运镜 | 画面描述 | 音效 | AI Prompt |
|------|------|------|----------|------|-----------|
| 00-03s | ECU | Push In | 描述 | 音效 | 英文提示词 |

### 📝 屏幕文字 (On-screen Text)

| 时间 | 文字内容 | 样式 |
|------|----------|------|
| 00:00 | 文字 | 样式描述 |

---

## 🎞️ Segment 2
[同上结构...]
```
