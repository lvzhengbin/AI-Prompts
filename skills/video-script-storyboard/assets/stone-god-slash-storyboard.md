# 🎬 石像天神一刀斩魔

## 📦 JSON 结构数据

```json
{
  "video_info": {
    "topic": "石像天神一刀斩魔",
    "targetAudience": "仙侠/玄幻/动漫爱好者",
    "durationTotal": "24s",
    "durationPerSegment": "8s",
    "resolution": "2K",
    "aspect_ratio": "竖屏 | 9:16",
    "tone": "史诗、庄严、震撼",
    "style": "国漫动漫风 (Chinese Anime)",
    "roles": [
      {
        "name": "许青",
        "description": "青年修士，黑发束冠，白色修士长袍，面容英俊但此刻满是震骇。瞳孔中映射出金色光芒。",
        "reference": "观察者/主视角"
      },
      {
        "name": "持刀石像 (天神)",
        "description": "巨大石像，身高约三丈，通体泛着金色光芒。身着古神战甲，手持一柄朴素的大刀。面容威严不可直视，周身环绕金色神纹。苏醒后石质肌肤裂开，露出内部的金色神躯。",
        "reference": "核心角色/天神"
      },
      {
        "name": "黑影",
        "description": "由浓郁黑气凝聚的人形暗影，红色双眼，周身散发腐蚀性的黑色雾气，形态模糊不定。",
        "reference": "反派/魔物"
      }
    ]
  },

  "segments": [
    {
      "segment_id": 1,
      "segment_name": "石像苏醒",
      "thumbnail_prompt": {
        "title": "Thumbnail Concept",
        "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词",
        "content": "A colossal stone statue holding a massive blade begins to glow with intense golden light, cracks of blinding radiance spreading across its surface. Chinese anime art style, cel-shaded, dramatic lighting. A young cultivator in white robes stands below, face in shock, eyes reflecting the golden glow. Dark temple interior background with floating dust particles illuminated by the divine light. Vertical composition 9:16. Epic, awe-inspiring atmosphere. High detail, 2K resolution."
      },
      "script": {
        "title": "Voiceover",
        "description": "旁白脚本 — 视频的口播/解说词内容",
        "content": "许青心神骇然——那尊沉寂万年的石像，竟然……活了！光芒万丈，如日破晓！"
      },
      "shotlist": {
        "title": "Visual Plan",
        "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效",
        "shots": [
          {
            "time": "00-02s",
            "shot_type": "ECU (特写)",
            "camera_movement": "静止→微推",
            "description": "许青的面部特写。瞳孔骤然收缩，金色光芒从画面外映入他的双眼，汗珠滑落。表情从平静急剧转为骇然。",
            "audio": "低沉嗡鸣声渐起",
            "ai_prompt": "Extreme close-up of a young man's face in Chinese anime style, cel-shaded. Black hair, golden light reflecting in widening pupils, sweat drops, expression shifting from calm to shock. Dark background with golden light creeping in from the right. Dramatic shadows. 9:16 vertical."
          },
          {
            "time": "02-04s",
            "shot_type": "WS (远景)",
            "camera_movement": "快速 Tilt Up 仰拍",
            "description": "镜头从许青渺小的背影快速上摇，揭示巨大石像全貌。石像表面开始出现金色裂纹，光芒从裂纹中迸射而出。神殿空间宏大，尘埃在光柱中飞舞。",
            "audio": "石头开裂的沉闷碎裂声 + 短促鼓点",
            "ai_prompt": "Wide shot tilting up, revealing a colossal stone statue with a blade in a dark ancient temple. Golden cracks spreading across the statue surface, blinding light beams shooting from the cracks. A tiny figure in white robes at the bottom looking up. Floating dust particles in light beams. Chinese anime style, epic scale. 9:16 vertical."
          },
          {
            "time": "04-06s",
            "shot_type": "MCU (中近景)",
            "camera_movement": "静止",
            "description": "石像面部特写。石质外壳从面部剥落，露出内部金色的神圣面容。双眼睁开，金色瞳孔亮起，散发不可直视的神威。",
            "audio": "金属质感的"铮——"鸣响 + 气浪冲击声",
            "ai_prompt": "Medium close-up of a giant stone statue face cracking open, Chinese anime style. Stone fragments falling away revealing a golden divine face beneath. Eyes opening with blazing golden pupils, radiant energy waves emanating. Ancient god armor details visible. Dramatic rim lighting. 9:16 vertical."
          },
          {
            "time": "06-08s",
            "shot_type": "FS (全景)",
            "camera_movement": "Dolly Out 后拉",
            "description": "石像通体金光大放，石质外壳碎裂剥落如蝉蜕。金色神纹覆盖全身，巨刀在手中发出嗡鸣。一只巨大的石足迈出底座，地面开裂——它，走下来了。",
            "audio": "雷鸣般轰隆声 + 碎石坠落 + BGM: 史诗鼓点骤起",
            "ai_prompt": "Full shot of massive stone statue fully awakening, shedding stone shell revealing golden divine warrior within. Golden rune patterns covering entire body, giant blade humming with energy. One massive foot stepping off the pedestal, ground cracking beneath. Debris and golden light particles. Chinese anime style, cel-shading, extreme dramatic lighting. 9:16 vertical."
          }
        ]
      },
      "onscreen_text": {
        "title": "Text Overlays",
        "description": "屏幕文字 — 视频中叠加显示的字幕/标题/引导文字",
        "items": [
          { "time": "00:00", "text": "⚡", "style": "闪烁特效，画面中央" },
          { "time": "02:00", "text": "万 年 封 印 ， 一 朝 苏 醒", "style": "竖排金色古风字体，左侧缓入" },
          { "time": "06:00", "text": "天 神 降 世", "style": "大号加粗金色字，粒子消散特效" }
        ]
      }
    },
    {
      "segment_id": 2,
      "segment_name": "天神降临",
      "thumbnail_prompt": {
        "title": "Thumbnail Concept",
        "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词",
        "content": "A golden divine warrior god descending stone temple stairs, each step causing the ground to crack and shatter. Chinese anime cel-shaded art style. Massive blade resting on shoulder, golden rune patterns flowing across ancient armor. A menacing dark shadow figure with red eyes waits at the bottom, surrounded by black mist. Intense contrast between golden divine light and dark evil energy. Vertical 9:16 composition. Ultra dramatic, epic cinematic moment."
      },
      "script": {
        "title": "Voiceover",
        "description": "旁白脚本 — 视频的口播/解说词内容",
        "content": "无上的威严，难以言喻的神圣。天神踏步而来，大地为之颤抖！每一步，都是对天道的宣告！"
      },
      "shotlist": {
        "title": "Visual Plan",
        "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效",
        "shots": [
          {
            "time": "00-02s",
            "shot_type": "CU (近景)",
            "camera_movement": "静止",
            "description": "天神的巨足踏在石板上的近景。脚落地的瞬间，地面以落点为中心向四面八方放射状碎裂，碎石飞溅。金色神纹从脚印中蔓延到地面。",
            "audio": "沉重轰鸣（BOOM）+ 碎石声",
            "ai_prompt": "Close-up of a massive golden armored foot stomping on stone ground, Chinese anime style. Impact cracks radiating outward from the footstep in all directions. Stone fragments flying. Golden rune patterns spreading from the footprint. Ground-level camera angle looking up. Dust and debris. 9:16 vertical."
          },
          {
            "time": "02-04s",
            "shot_type": "MS (中景)",
            "camera_movement": "Tracking 跟随上移",
            "description": "从脚部跟随上移至天神上半身。巨大身躯迈步前行，战甲金光流转，披风（或神纹光带）在身后猎猎飘动。大刀横于身侧，刀身倒映出黑影的轮廓。",
            "audio": "沉重脚步声（节奏如战鼓）+ 金属鸣响",
            "ai_prompt": "Medium shot tracking upward along a colossal golden divine warrior walking forward, Chinese anime cel-shaded style. Ancient golden armor with flowing rune patterns, energy cape billowing behind. Massive blade at side reflecting a dark shadow. Each step resonating with power. Dramatic low angle. 9:16 vertical."
          },
          {
            "time": "04-06s",
            "shot_type": "OTS (过肩)",
            "camera_movement": "静止→微推",
            "description": "从天神肩部越过，看向前方的黑影。黑影形态扭曲翻涌，红色双眼在黑雾中闪烁。两者之间的空间中，金色光芒与黑色雾气交汇碰撞，发出嘶嘶声。",
            "audio": "黑气翻涌的嘶嘶声 + 能量碰撞的电弧声",
            "ai_prompt": "Over-the-shoulder shot from behind a massive golden armored warrior, looking toward a dark shadowy figure with glowing red eyes ahead. Chinese anime style. Golden holy light clashing against dark evil mist energy between them. Electric crackling where energies meet. Ominous atmosphere. Temple corridor setting. 9:16 vertical."
          },
          {
            "time": "06-08s",
            "shot_type": "WS (远景)",
            "camera_movement": "静止 (对峙构图)",
            "description": "画面左侧天神金光万丈，右侧黑影暗雾翻腾。两者对峙，中间地面已碎裂为深渊裂缝，金色与黑色能量在裂缝中交织。许青在远处角落渺小身影，匍匐在地，无法承受这等气压。",
            "audio": "低频压迫感嗡鸣 + 风声骤起 → 短暂寂静",
            "ai_prompt": "Wide shot of epic confrontation, Chinese anime style. Left side: colossal golden divine warrior god radiating blinding golden light. Right side: dark shadow entity with red eyes, surrounded by swirling black mist. Ground between them cracked into an abyss with gold and black energy intertwining. Tiny figure in white cowering in far corner. Temple setting crumbling. 9:16 vertical."
          }
        ]
      },
      "onscreen_text": {
        "title": "Text Overlays",
        "description": "屏幕文字 — 视频中叠加显示的字幕/标题/引导文字",
        "items": [
          { "time": "00:00", "text": "💥 BOOM", "style": "冲击波扩散特效" },
          { "time": "02:00", "text": "天 威 不 可 犯", "style": "竖排描边金字，右侧浮现" },
          { "time": "06:00", "text": "⚔️", "style": "画面中央闪烁，预示一刀" }
        ]
      }
    },
    {
      "segment_id": 3,
      "segment_name": "一刀惊天",
      "thumbnail_prompt": {
        "title": "Thumbnail Concept",
        "description": "缩略图提示词 — 用于生成视频封面/缩略图的 AI 绘图提示词",
        "content": "The climactic moment: A divine golden warrior mid-slash with a massive blade, creating a blinding arc of golden light that splits the entire screen diagonally. Chinese anime style, speed lines, motion blur. The dark shadow being cleaved in two, dissolving into particles. Extreme dynamic composition with energy shockwave expanding outward. A young cultivator in white shielding his eyes in the background. Vertical 9:16. Peak dramatic moment, ultra epic."
      },
      "script": {
        "title": "Voiceover",
        "description": "旁白脚本 — 视频的口播/解说词内容",
        "content": "手起，刀落。一刀，仅此一刀。朴实无华，却暗合天地大道！这一斩——惊天动地！"
      },
      "shotlist": {
        "title": "Visual Plan",
        "description": "分镜镜头表 — 按时间轴描述每个镜头的画面内容、运镜方式和音效",
        "shots": [
          {
            "time": "00-02s",
            "shot_type": "MCU (中近景)",
            "camera_movement": "Push In 快推",
            "description": "天神握刀的手部特写。五指收紧，金色神纹在手背上亮起。刀柄上的古老铭文逐一点亮。刀身开始发出低沉的嗡鸣颤动波纹。",
            "audio": "金属蓄力嗡鸣（由低至高）",
            "ai_prompt": "Medium close-up of a massive golden divine hand gripping a blade handle, Chinese anime cel-shaded style. Golden rune patterns lighting up on the hand. Ancient inscriptions on the blade handle glowing one by one. Energy vibration ripples along the blade surface. Dramatic tension building. Dark background. 9:16 vertical."
          },
          {
            "time": "02-04s",
            "shot_type": "FS (全景)",
            "camera_movement": "静止 (慢动作感)",
            "description": "天神举刀过顶的全身像。刀高举至最高点，整个画面定格般的紧张瞬间。刀刃汇聚周围所有光芒，像一轮太阳悬在头顶。黑影开始向后退缩。速度线从四周向刀尖汇聚。",
            "audio": "完全寂静（1秒）→ 心跳声两下",
            "ai_prompt": "Full shot of divine golden warrior raising massive blade above head, Chinese anime style. All light in the scene converging into the blade edge like a sun. Speed lines focusing toward the blade tip. Dark shadow figure recoiling in fear below. Frozen-moment composition, extreme tension. Golden energy spiraling upward. 9:16 vertical."
          },
          {
            "time": "04-06s",
            "shot_type": "WS→ECU (远至特写)",
            "camera_movement": "Zoom In 极速变焦",
            "description": "高潮一刀！天神手臂挥下，金色刀光划出一道贯穿整个画面的对角线光弧。画面瞬间从远景极速zoom到刀锋切入黑影的那一刻。黑影被一刀两断，碎裂成无数黑色粒子消散。冲击波从斩击点向外扩散，地面翻涌。",
            "audio": ""嚓——"极清脆的金属斩击声 → 巨大冲击爆炸声（BOOM）",
            "ai_prompt": "Dynamic action shot, Chinese anime style with speed lines and motion blur. Golden divine warrior executing a massive downward slash. Blinding golden arc of blade light cutting diagonally across entire frame. Dark shadow being cleaved in half, dissolving into black particles. Shockwave expanding from the strike point. Ground shattering. Extreme dynamic composition. 9:16 vertical. Peak climactic moment."
          },
          {
            "time": "06-08s",
            "shot_type": "WS (远景)",
            "camera_movement": "静止→缓慢 Pull Back",
            "description": "余波。天神持刀而立，保持收刀姿势。周围一切归于平静。黑色粒子如萤火般缓缓消散在空中。金色光芒温和地笼罩整个场景。许青跪在地上，仰望天神，泪流满面。地面的裂纹中透出金色微光。",
            "audio": "余音回响渐弱 → 空灵悠远的古琴/箫声起",
            "ai_prompt": "Wide shot aftermath scene, Chinese anime style. Golden divine warrior standing still in post-slash pose, blade lowered. Black particles floating and dissolving like fireflies in the air. Warm golden light bathing the entire scene peacefully. Young cultivator in white kneeling on the ground looking up in tears and awe. Cracked ground with faint golden glow seeping through. Serene yet powerful atmosphere. 9:16 vertical."
          }
        ]
      },
      "onscreen_text": {
        "title": "Text Overlays",
        "description": "屏幕文字 — 视频中叠加显示的字幕/标题/引导文字",
        "items": [
          { "time": "00:00", "text": "手起…", "style": "金色手写体，淡入" },
          { "time": "02:00", "text": "刀落。", "style": "金色手写体，闪入" },
          { "time": "04:00", "text": "⚡💥 一刀断魔 💥⚡", "style": "全屏爆炸式弹出，震屏效果" },
          { "time": "06:00", "text": "朴实无华，暗合大道", "style": "白色古风字体，居中缓出" },
          { "time": "07:00", "text": "👇 关注 点赞 下一回更精彩", "style": "CTA 底部动画弹出" }
        ]
      }
    }
  ]
}
```

---

## 📋 视频信息

| 项目 | 内容 |
|------|------|
| 主题 | 石像天神一刀斩魔 |
| 目标受众 | 仙侠/玄幻/动漫爱好者 |
| 总时长 | ~24s (3 segments) |
| 单段时长 | 8s |
| 分辨率 | 2K |
| 画幅比 | 竖屏 9:16 |
| 音调 | 史诗、庄严、震撼 |
| 风格 | 国漫动漫风 (Chinese Anime) |

### 角色设定

| 角色 | 外观描述 | 定位 |
|------|----------|------|
| 许青 | 青年修士，黑发束冠，白色修士长袍，面容英俊但此刻满是震骇。瞳孔中映射出金色光芒。 | 观察者/主视角 |
| 持刀石像 (天神) | 巨大石像，身高约三丈，通体泛着金色光芒。身着古神战甲，手持一柄朴素的大刀。面容威严不可直视，周身环绕金色神纹。苏醒后石质肌肤裂开，露出内部的金色神躯。 | 核心角色/天神 |
| 黑影 | 由浓郁黑气凝聚的人形暗影，红色双眼，周身散发腐蚀性的黑色雾气，形态模糊不定。 | 反派/魔物 |

---

## 🎞️ Segment 1 — 石像苏醒 (0-8s)

### 🖼️ 缩略图提示词 (Thumbnail Prompt)

> A colossal stone statue holding a massive blade begins to glow with intense golden light, cracks of blinding radiance spreading across its surface. Chinese anime art style, cel-shaded, dramatic lighting. A young cultivator in white robes stands below, face in shock, eyes reflecting the golden glow. Dark temple interior background with floating dust particles illuminated by the divine light. Vertical composition 9:16. Epic, awe-inspiring atmosphere. High detail, 2K resolution.

### 🎙️ 旁白脚本 (Voiceover)

> 许青心神骇然——那尊沉寂万年的石像，竟然……活了！光芒万丈，如日破晓！

### 🎥 分镜镜头表 (Shot List)

| 时间 | 景别 | 运镜 | 画面描述 | 音效 | AI Prompt |
|------|------|------|----------|------|-----------|
| 00-02s | ECU 特写 | 静止→微推 | 许青的面部特写。瞳孔骤然收缩，金色光芒从画面外映入他的双眼，汗珠滑落。表情从平静急剧转为骇然。 | 低沉嗡鸣声渐起 | `Extreme close-up of a young man's face in Chinese anime style, cel-shaded. Black hair, golden light reflecting in widening pupils, sweat drops, expression shifting from calm to shock. Dark background with golden light creeping in from the right. Dramatic shadows. 9:16 vertical.` |
| 02-04s | WS 远景 | 快速Tilt Up 仰拍 | 镜头从许青渺小的背影快速上摇，揭示巨大石像全貌。石像表面开始出现金色裂纹，光芒从裂纹中迸射而出。神殿空间宏大，尘埃在光柱中飞舞。 | 石头开裂的沉闷碎裂声 + 短促鼓点 | `Wide shot tilting up, revealing a colossal stone statue with a blade in a dark ancient temple. Golden cracks spreading across the statue surface, blinding light beams shooting from the cracks. A tiny figure in white robes at the bottom looking up. Floating dust particles in light beams. Chinese anime style, epic scale. 9:16 vertical.` |
| 04-06s | MCU 中近景 | 静止 | 石像面部特写。石质外壳从面部剥落，露出内部金色的神圣面容。双眼睁开，金色瞳孔亮起，散发不可直视的神威。 | 金属质感的"铮——"鸣响 + 气浪冲击声 | `Medium close-up of a giant stone statue face cracking open, Chinese anime style. Stone fragments falling away revealing a golden divine face beneath. Eyes opening with blazing golden pupils, radiant energy waves emanating. Ancient god armor details visible. Dramatic rim lighting. 9:16 vertical.` |
| 06-08s | FS 全景 | Dolly Out 后拉 | 石像通体金光大放，石质外壳碎裂剥落如蝉蜕。金色神纹覆盖全身，巨刀在手中发出嗡鸣。一只巨大的石足迈出底座，地面开裂——它，走下来了。 | 雷鸣般轰隆声 + 碎石坠落 + BGM: 史诗鼓点骤起 | `Full shot of massive stone statue fully awakening, shedding stone shell revealing golden divine warrior within. Golden rune patterns covering entire body, giant blade humming with energy. One massive foot stepping off the pedestal, ground cracking beneath. Debris and golden light particles. Chinese anime style, cel-shading, extreme dramatic lighting. 9:16 vertical.` |

### 📝 屏幕文字 (On-screen Text)

| 时间 | 文字内容 | 样式 |
|------|----------|------|
| 00:00 | ⚡ | 闪烁特效，画面中央 |
| 02:00 | 万 年 封 印 ， 一 朝 苏 醒 | 竖排金色古风字体，左侧缓入 |
| 06:00 | 天 神 降 世 | 大号加粗金色字，粒子消散特效 |

---

## 🎞️ Segment 2 — 天神降临 (0-8s)

### 🖼️ 缩略图提示词 (Thumbnail Prompt)

> A golden divine warrior god descending stone temple stairs, each step causing the ground to crack and shatter. Chinese anime cel-shaded art style. Massive blade resting on shoulder, golden rune patterns flowing across ancient armor. A menacing dark shadow figure with red eyes waits at the bottom, surrounded by black mist. Intense contrast between golden divine light and dark evil energy. Vertical 9:16 composition. Ultra dramatic, epic cinematic moment.

### 🎙️ 旁白脚本 (Voiceover)

> 无上的威严，难以言喻的神圣。天神踏步而来，大地为之颤抖！每一步，都是对天道的宣告！

### 🎥 分镜镜头表 (Shot List)

| 时间 | 景别 | 运镜 | 画面描述 | 音效 | AI Prompt |
|------|------|------|----------|------|-----------|
| 00-02s | CU 近景 | 静止 | 天神的巨足踏在石板上的近景。脚落地的瞬间，地面以落点为中心向四面八方放射状碎裂，碎石飞溅。金色神纹从脚印中蔓延到地面。 | 沉重轰鸣（BOOM）+ 碎石声 | `Close-up of a massive golden armored foot stomping on stone ground, Chinese anime style. Impact cracks radiating outward from the footstep in all directions. Stone fragments flying. Golden rune patterns spreading from the footprint. Ground-level camera angle looking up. Dust and debris. 9:16 vertical.` |
| 02-04s | MS 中景 | Tracking 跟随上移 | 从脚部跟随上移至天神上半身。巨大身躯迈步前行，战甲金光流转，披风（或神纹光带）在身后猎猎飘动。大刀横于身侧，刀身倒映出黑影的轮廓。 | 沉重脚步声（节奏如战鼓）+ 金属鸣响 | `Medium shot tracking upward along a colossal golden divine warrior walking forward, Chinese anime cel-shaded style. Ancient golden armor with flowing rune patterns, energy cape billowing behind. Massive blade at side reflecting a dark shadow. Each step resonating with power. Dramatic low angle. 9:16 vertical.` |
| 04-06s | OTS 过肩 | 静止→微推 | 从天神肩部越过，看向前方的黑影。黑影形态扭曲翻涌，红色双眼在黑雾中闪烁。两者之间的空间中，金色光芒与黑色雾气交汇碰撞，发出嘶嘶声。 | 黑气翻涌的嘶嘶声 + 能量碰撞的电弧声 | `Over-the-shoulder shot from behind a massive golden armored warrior, looking toward a dark shadowy figure with glowing red eyes ahead. Chinese anime style. Golden holy light clashing against dark evil mist energy between them. Electric crackling where energies meet. Ominous atmosphere. Temple corridor setting. 9:16 vertical.` |
| 06-08s | WS 远景 | 静止（对峙构图） | 画面左侧天神金光万丈，右侧黑影暗雾翻腾。两者对峙，中间地面已碎裂为深渊裂缝，金色与黑色能量在裂缝中交织。许青在远处角落渺小身影，匍匐在地，无法承受这等气压。 | 低频压迫感嗡鸣 + 风声骤起 → 短暂寂静 | `Wide shot of epic confrontation, Chinese anime style. Left side: colossal golden divine warrior god radiating blinding golden light. Right side: dark shadow entity with red eyes, surrounded by swirling black mist. Ground between them cracked into an abyss with gold and black energy intertwining. Tiny figure in white cowering in far corner. Temple setting crumbling. 9:16 vertical.` |

### 📝 屏幕文字 (On-screen Text)

| 时间 | 文字内容 | 样式 |
|------|----------|------|
| 00:00 | 💥 BOOM | 冲击波扩散特效 |
| 02:00 | 天 威 不 可 犯 | 竖排描边金字，右侧浮现 |
| 06:00 | ⚔️ | 画面中央闪烁，预示一刀 |

---

## 🎞️ Segment 3 — 一刀惊天 (0-8s)

### 🖼️ 缩略图提示词 (Thumbnail Prompt)

> The climactic moment: A divine golden warrior mid-slash with a massive blade, creating a blinding arc of golden light that splits the entire screen diagonally. Chinese anime style, speed lines, motion blur. The dark shadow being cleaved in two, dissolving into particles. Extreme dynamic composition with energy shockwave expanding outward. A young cultivator in white shielding his eyes in the background. Vertical 9:16. Peak dramatic moment, ultra epic.

### 🎙️ 旁白脚本 (Voiceover)

> 手起，刀落。一刀，仅此一刀。朴实无华，却暗合天地大道！这一斩——惊天动地！

### 🎥 分镜镜头表 (Shot List)

| 时间 | 景别 | 运镜 | 画面描述 | 音效 | AI Prompt |
|------|------|------|----------|------|-----------|
| 00-02s | MCU 中近景 | Push In 快推 | 天神握刀的手部特写。五指收紧，金色神纹在手背上亮起。刀柄上的古老铭文逐一点亮。刀身开始发出低沉的嗡鸣颤动波纹。 | 金属蓄力嗡鸣（由低至高）| `Medium close-up of a massive golden divine hand gripping a blade handle, Chinese anime cel-shaded style. Golden rune patterns lighting up on the hand. Ancient inscriptions on the blade handle glowing one by one. Energy vibration ripples along the blade surface. Dramatic tension building. Dark background. 9:16 vertical.` |
| 02-04s | FS 全景 | 静止（慢动作感） | 天神举刀过顶的全身像。刀高举至最高点，整个画面定格般的紧张瞬间。刀刃汇聚周围所有光芒，像一轮太阳悬在头顶。黑影开始向后退缩。速度线从四周向刀尖汇聚。 | 完全寂静（1秒）→ 心跳声两下 | `Full shot of divine golden warrior raising massive blade above head, Chinese anime style. All light in the scene converging into the blade edge like a sun. Speed lines focusing toward the blade tip. Dark shadow figure recoiling in fear below. Frozen-moment composition, extreme tension. Golden energy spiraling upward. 9:16 vertical.` |
| 04-06s | WS→ECU 远至特写 | Zoom In 极速变焦 | 高潮一刀！天神手臂挥下，金色刀光划出一道贯穿整个画面的对角线光弧。画面瞬间从远景极速zoom到刀锋切入黑影的那一刻。黑影被一刀两断，碎裂成无数黑色粒子消散。冲击波从斩击点向外扩散，地面翻涌。 | "嚓——"极清脆的金属斩击声 → 巨大冲击爆炸声（BOOM）| `Dynamic action shot, Chinese anime style with speed lines and motion blur. Golden divine warrior executing a massive downward slash. Blinding golden arc of blade light cutting diagonally across entire frame. Dark shadow being cleaved in half, dissolving into black particles. Shockwave expanding from the strike point. Ground shattering. Extreme dynamic composition. 9:16 vertical. Peak climactic moment.` |
| 06-08s | WS 远景 | 静止→缓慢 Pull Back | 余波。天神持刀而立，保持收刀姿势。周围一切归于平静。黑色粒子如萤火般缓缓消散在空中。金色光芒温和地笼罩整个场景。许青跪在地上，仰望天神，泪流满面。地面的裂纹中透出金色微光。 | 余音回响渐弱 → 空灵悠远的古琴/箫声起 | `Wide shot aftermath scene, Chinese anime style. Golden divine warrior standing still in post-slash pose, blade lowered. Black particles floating and dissolving like fireflies in the air. Warm golden light bathing the entire scene peacefully. Young cultivator in white kneeling on the ground looking up in tears and awe. Cracked ground with faint golden glow seeping through. Serene yet powerful atmosphere. 9:16 vertical.` |

### 📝 屏幕文字 (On-screen Text)

| 时间 | 文字内容 | 样式 |
|------|----------|------|
| 00:00 | 手起… | 金色手写体，淡入 |
| 02:00 | 刀落。 | 金色手写体，闪入 |
| 04:00 | ⚡💥 一刀断魔 💥⚡ | 全屏爆炸式弹出，震屏效果 |
| 06:00 | 朴实无华，暗合大道 | 白色古风字体，居中缓出 |
| 07:00 | 👇 关注 点赞 下一回更精彩 | CTA 底部动画弹出 |

---

## 🎵 BGM 建议

| 段落 | 音乐风格 | 参考 |
|------|----------|------|
| Segment 1 (苏醒) | 低沉嗡鸣 → 史诗鼓点渐起 | 类似《斗破苍穹》配乐起势段 |
| Segment 2 (降临) | 战鼓节奏 + 古风弦乐，压迫感递增 | 类似《完美世界》战斗前奏 |
| Segment 3 (一刀) | 0-4s极致蓄力 → 4s爆发高潮 → 6-8s空灵余韵 | 类似《仙剑》高潮段 + 古琴收尾 |
