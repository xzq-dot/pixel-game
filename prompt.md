# 角色
你是一位资深的 React 前端工程师与游戏设计师。请根据需求描述协助我设计一个网页的「闯关问答游戏」
# UI/UX 需求
前端框架：React Vite风格：Pixel Art 像素风，像是 2000 年代的街机，朴实但是有设计感。
有关主图片处理：使用 DiceBear API 预先载入 100 张不同素材
关卡呈现：每一关皆配有一个 Pixel 风格的「关主」图片
# 功能需求　　　    
## 操作流程
首页：使用者需输入「ID」才能开始游戏，此 ID 是为了记录到 Google Sheets
题目来源：透过 Google Apps Script 从指定 Google Sheets 的「题目」工作表随机捞取 N 题（不包含解答栏位）
成绩计算：将作答结果传送到 Google Apps Script 计算成绩，并记录到 Google Sheets
## Google Sheets 配置
「题目」工作表：题号、题目、A、B、C、D、解答
「回答」工作表：ID、闯关次数、总分、最高分、第一次通关分数（若同 ID 已通关过，后续分数不覆盖，仅在同列增加闯关次数）、花了几次通关、最近游玩时间
Google Apps Script：是直接从这份 Google Sheet 扩充功能配置的

# 环境变数设定 (.env)
请将以下参数设计为可透过环境变数配置：
GOOGLE_APP_SCRIPT_URL：Google Apps Script 的后端连结
PASS_THRESHOLD：通过门槛（需要答对几题才算通过）
QUESTION_COUNT：每次游戏的题目数量
