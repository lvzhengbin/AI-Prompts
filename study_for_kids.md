# AI Prompts for 小孩学习使用

## 英语学习闪卡 - 单词版

```
生成英语学习单词闪卡，要求如下：
1.闪卡的背景为纯白色，内容中间部分显示为单词对应的意思（可能是动物/人物/物品，颜色使用彩色, 风格为小朋友喜欢的卡通风格），下面有单词的文案(字母全部使用小写，颜色为黑色)和单词的美式发音音标（颜色为黑色）
2.标准A4纸的大背景，根据闪卡数量全部平均占满A4纸内容，闪卡之间不留间隙
3.内容平面显示，不要生成系统的场景背景
4.每个闪卡的描边为橙色
5.如果有上传附件则参考附件图片效果输出

请按照上面的要求对以下单词生成英语学习闪卡
"dog" "tiger" "Apple" "banana" "hello" "sorry"
```

### 效果示例
![单词闪卡](/word_flash_card.png)

---

## 英语学习闪卡 - 数字互动版

```
生成儿童英语数字学习互动闪卡，整体布局为**A4纸横向打印尺寸（297mm x 210mm）**，包含以下结构：

### 顶部区域（占1/3）：
1. **姓名栏**：左上角有"Name ______"的手写线条
2. **数字单词**：正中间显示数字的英文单词（如"two"），使用深蓝绿色，字体清晰易读
3. **数字**：数字单词右侧显示大号阿拉伯数字（如"2"），使用深蓝绿色
4. **示例图片**：右上角显示一个物品堆叠的卡通图案（用深蓝色和橙色配色），简洁扁平风格
5. **示例文字**：示例图片下方有对应的名词标签（如"hats."）

### 中部区域（占1/3）：
- 显示完整句子："I have [数字] [名词复数]."
- 使用手写体风格的字体
- 数字用阿拉伯数字显示
- 文字为黑色，清晰易读

### 底部区域（占1/3）：
- 分为4个等宽的选项格子，每格包含：
  - 上方：物品的卡通剪影图（使用深蓝色、橙红色、绿色等不同颜色区分）
  - 下方：物品名词的文字标签（如"coats." "mittens." "scarves." "boots."）
  - 左上角标注统一的类别标签（如"CleverShade"）
- 图片风格统一为扁平卡通剪影风格
- 每个选项之间有细线分隔

### 整体风格要求：
1. **纸张规格**：A4纸横向打印（297mm宽 x 210mm高）
2. 背景纯白色，布局整洁
3. 色彩搭配：深蓝色为主色，橙色、红色、绿色为辅助色
4. 图片风格：扁平化卡通剪影，简洁可爱
5. 字体：标题使用清晰的印刷体，句子使用手写体
6. 整体设计适合3-6岁儿童使用
7. 版面左下角有版权标注（小字）
8. 确保内容适配横向A4纸打印，布局合理分布

请按照这个模板生成数字学习闪卡，数字范围从1-10，每个数字配对不同的名词类别（如：衣物、动物、水果、玩具等）。
```

---

## 插图绘画上色 Promot

```
A black and white line drawing coloring illustration, suitable for direct printing on standard size (8.5x11 inch) paper, without paper borders. The overall illustration style is fresh and simple, using clear and smooth black outline lines, without shadows, grayscale, or color filling, with a pure white background for easy coloring.
[At the same time, for the convenience of users who are not good at coloring, please generate a complete colored version in the lower right corner as a small image for reference]
Suitable for: [6-9 year old children]
Scene description:
[A unicorn is walking on the grass in the forest, with bright sunshine, blue sky and white clouds]
```

### 效果示例
![插图上色](/color_drawing.png)

---

## 两张图片找不同 Prompt

```
参考@find_the_difference.jpeg 图片的上下排版样式，设计一张找不同题目的图片，可打印A4页面（竖版，210mm×297mm），有如下要求：
1. 图片的内容和元素都需要是新的内容，不能参考参考图的内容
2. 图片为竖版，大小为：210mm×297mm
3. 图片风格为卡通风格，适合儿童使用
4. 两张图片为同一场景，但是有细微的不同之处
5. 两张图片中只能出现7处不相同的地方（可以为颜色，形状或物品），同时图片顶部的标题内容要显示“请找出7处不同”
```

### 效果示例
![找不同](/find_the_difference.jpeg)