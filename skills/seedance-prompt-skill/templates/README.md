# Seedance 2.0 十大能力模板参考

本目录包含 Seedance 2.0 的十大核心能力模板，在生成提示词时根据具体场景选择合适的能力模板作为参考。

## 能力索引

| # | 能力 | 文件 | 适用场景 |
|---|------|------|----------|
| 1 | 纯文本生成 | [text-to-video.md](text-to-video.md) | 无参考素材，纯文字描述生成 |
| 2 | 一致性控制 | [consistency-control.md](consistency-control.md) | 角色/产品/场景的跨镜头统一 |
| 3 | 运镜与动作复刻 | [motion-replication.md](motion-replication.md) | 复刻参考视频的镜头/动作/节奏 |
| 4 | 创意模板/特效复刻 | [creative-effects.md](creative-effects.md) | 模仿参考视频的创意转场/特效 |
| 5 | 剧情创作/补全 | [story-creation.md](story-creation.md) | 根据分镜脚本/图片自动生成剧情 |
| 6 | 视频延长 | [video-extension.md](video-extension.md) | 已有视频的平滑延长 |
| 7 | 声音控制 | [sound-control.md](sound-control.md) | 音色参考、对白生成、音效设计 |
| 8 | 一镜到底 | [long-take.md](long-take.md) | 连贯长镜头，无切镜 |
| 9 | 视频编辑 | [video-editing.md](video-editing.md) | 角色替换、剧情颠覆、元素增减 |
| 10 | 音乐卡点 | [music-sync.md](music-sync.md) | 画面与音乐节拍精准匹配 |

## 能力组合指南

实际创作中，常需要**组合多种能力**。以下是常见组合：

| 组合 | 能力搭配 | 典型场景 |
|------|----------|----------|
| 角色动画 | 一致性控制 + 运镜复刻 | 用角色图片+参考动作视频，生成角色动画 |
| 广告创意 | 一致性控制 + 创意模板复刻 | 用产品图+参考广告视频，生成新广告 |
| 续集延展 | 视频延长 + 声音控制 | 延长已有视频并控制音色/音效 |
| 翻拍改编 | 视频编辑 + 一致性控制 | 替换视频中的角色为自定义角色 |
| MV制作 | 音乐卡点 + 一致性控制 | 多图卡点+角色一致 |
