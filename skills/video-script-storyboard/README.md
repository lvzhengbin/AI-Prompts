 # Video Script + Storyboard (AI) 

 > https://apify.com/macheta/video-script-storyboard 

创建一个 video-script-storyboard 功能的skill

Generate a video package for short-form or long-form content。
生成视频钩子、脚本和分镜镜头表 (Storyboard Shot Lists)
核心功能: 它不仅仅生成剧本，还能生成分镜镜头表 (Storyboard Shot Lists)、视频钩子 (Hooks)、屏幕文字 (On-screen text) 以及缩略图提示词。

生成 镜头描述，视频风格，视频场景类型作为references引用参考文件, 将输出示例模版放在templates文件夹下面

工作流程如下：
第一步：获取用户输入
用户只需提供想生成的主题内容
询问用户输入 topic主题故事内容


第二步：确认关键参数
通过提问确认以下信息（用户已明确的可跳过）
- targetAudience 受众目标用户
- durationSeconds 单段视频最大时长参数（可选 默认值：单段视频最长8秒）
- 分辨率（可选 默认2K）
- 尺寸与画幅比规则 （如[尺寸]竖屏/横屏 + [画幅比]2.35:1/16:9/9:16）
- tone 音调描述 （可选）
- 多角色描述（照片/图片/文本描述）- 确保角色生成的一致性


第三步：生成提示词和脚本内容
（将输出示例模版也放在templates文件夹下面）

### 输出示例
```
{
  video_info:{
    "targetAudience":"动漫爱好者",
    "durationTotal": 14s,
    "durationSeconds": 8s,
    "aspect_ratio": "竖屏 | 16:9",
    "roles":[

    ]
  },

  video_1: [
  {
    "type": "thumbnail_prompt", 
    "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词，描述封面的画面构图、风格和元素",
    "title": "Thumbnail Concept",
    "content": "Split screen intense face-off. Left side: Pikachu cheeks sparking with yellow lightning, angry eyes. Right side: Bulbasaur (Miaohua seeds) with vines extending aggressively, determined expression. Background: A blurred stadium arena with 'VS' in flaming letters in the center. Bright, saturated anime style."
  },
  {
    "type": "script",
    "description": "旁白脚本 — 视频的口播/解说词内容，即视频中需要说出来的话",
    "title": "Voiceover",
    "content": "It's the ultimate showdown! Pikachu versus Bulbasaur! Speed versus Power! Thunderbolt meets Vine Whip! Wait... did they just become best friends? Subscribe and vote for the true winner!"
  },
  {
    "type": "shotlist",
    "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效，是视频拍摄/制作的可视化计划",
    "title": "Visual Plan",
    "content": "00-03s: Extreme close-up split screen of Pikachu and Bulbasaur's eyes. Sound: Battle siren.\n03-08s: Fast-paced montage of Pikachu dodging vines and Bulbasaur blocking electricity. Camera shakes with impact."
  },
  {
    "type": "onscreen_text",
    "description": "屏幕文字 — 视频中叠加显示的字幕、标题或引导性文字（如 CTA 按钮提示），按时间点排列",
    "title": "Text Overlays",
    "content": "00:00 ELECTRIC ⚡ VS GRASS 🍃\n00:03 FIGHT!\n00:06 WHO WON? 👇"
  }
],

video_2:[
 {
    "type": "thumbnail_prompt", 
    "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词，描述封面的画面构图、风格和元素",
    "title": "Thumbnail Concept",
    "content": ""
  },
  {
    "type": "script",
    "description": "旁白脚本 — 视频的口播/解说词内容，即视频中需要说出来的话",
    "title": "Voiceover",
    "content": "Start the fight"
  },
  {
    "type": "shotlist",
    "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效，是视频拍摄/制作的可视化计划",
    "title": "Visual Plan",
    "content": "00-03s: A massive dust cloud from the clash clears. Instead of fighting, they are high-fiving/dancing.\n03-06s: Both Pokemon look at the camera and smile. CTA arrow points to the subscribe button."
  },
  {
    "type": "onscreen_text",
    "description": "屏幕文字 — 视频中叠加显示的字幕、标题或引导性文字（如 CTA 按钮提示），按时间点排列",
    "title": "Text Overlays",
    "content": "00:03 FIGHT!\n00:06 WHO WON? 👇"
  }
]

}

```

第四步：用户确定与微调优化
用户review内容后，可以要求：
调整某个时间段的画面内容
更换风格/色调/镜头语言
增减台词/音效描述
调整时长或分段方式

第五步：完成最终完整的提示词和脚本内容 输出为markdown文档 存放在该skill的 assets/ 下面





## https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill 
可支持漫画分镜和storyboard  待测试

