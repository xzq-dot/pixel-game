# Pixel Art Quiz Game (像素风闯关问答游戏)

这是一个使用 React (Vite) 构建的 2000 年代街机像素风格问答游戏。游戏前端包含像素风 UI 与动态交互，后端通过 Google Apps Script (GAS) 直接读取和写入你的 Google Sheets 作为轻量级数据库。

## 🚀 1. 本地安装与启动

1. **安装 Node.js 依赖**：
   确保你的电脑已安装 [Node.js](https://nodejs.org/)。在终端中进入项目目录，执行以下命令安装依赖：
   ```bash
   npm install
   ```

2. **启动本地开发服务器**：
   ```bash
   npm run dev
   ```
   *启动后浏览器将自动弹出并访问 `http://localhost:5173`。在未配置 Google Sheets 之前，应用会使用内置的 Mock 假数据来演示流程。*

---

## 📊 2. 配置 Google Sheets 数据库

你需要创建一个 Google Sheets 作为题库和成绩记录。

### 步骤 A：创建工作表
1. 新建一个 Google Sheets 文档。
2. 将底部的第一个工作表（Sheet1）重命名为：**`题目`**
3. 在**`题目`**工作表的第一行（表头）依次填入：
   `题号` | `题目` | `A` | `B` | `C` | `D` | `解答`
4. 新建第二个工作表，命名为：**`回答`**
5. 在**`回答`**工作表的第一行（表头）依次填入：
   `ID` | `闯关次数` | `总分` | `最高分` | `第一次通关分数` | `花了几次通关` | `最近游玩时间`

### 步骤 B：复制 10 道测试题（生成式 AI 基础知识）
你可以直接复制下方表格的内容，然后到**`题目`**工作表的 `A2` 单元格按 `Ctrl+V` (或 `Cmd+V`) 粘贴，即可快速填充测试数据。

| 题号 | 题目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 什么是生成式 AI (Generative AI)？ | 只能做数学运算的 AI | 能够生成文本、图像等新内容的 AI | 专门用于自动驾驶的 AI | 一种电脑病毒 | B |
| 2 | 以下哪一个是生成式 AI 文本模型的著名例子？ | ChatGPT | Microsoft Excel | Adobe Photoshop | Google Maps | A |
| 3 | 生成式 AI 通常基于哪种底层架构？ | 关系型数据库 | 决策树 | 深度神经网络 (如 Transformer) | 排序算法 | C |
| 4 | "Prompt" (提示词) 在生成式 AI 中指的是什么？ | 程序的错误代码 | 用户提供给 AI 以指导其生成内容的指令 | AI 运行的速度 | 一种编程语言 | B |
| 5 | 以下哪项是 Midjourney 的主要用途？ | 编写代码 | 制作电子表格 | 通过文本生成图像 | 视频剪辑 | C |
| 6 | 什么是大语言模型 (LLM) 的“幻觉” (Hallucination)？ | AI 模型产生的视觉特效 | AI 运行太久导致过热 | AI 生成看似合理但其实错误或虚构的信息 | 一种高级的 AI 学习技巧 | C |
| 7 | 生成式 AI 可以进行以下哪项任务？ | 翻译语言 | 创作诗歌 | 编写代码 | 以上皆是 | D |
| 8 | 关于生成式 AI 的数据隐私，以下哪项描述是正确的？ | 所有的输入数据都不会被保存 | 输入的数据可能被用于训练模型，需避免输入机密信息 | 生成式 AI 不需要任何数据就能学习 | 任何人都可以查看他人的记录 | B |
| 9 | 什么是“微调” (Fine-tuning)？ | 调整电脑显示器的亮度 | 在预训练大模型的基础上使用特定数据进一步训练以优化表现 | 清理 AI 系统的缓存 | 给 AI 安装杀毒软件 | B |
| 10 | 以下哪个不是生成式 AI 常见的输出形式？ | 文本 | 实体硬件 | 音频 | 图像 | B |

---

## ⚙️ 3. 部署 Google Apps Script 后端

1. 在你刚才创建的 Google Sheets 菜单栏中，点击 **`扩展程序 (Extensions)`** -> **`Apps Script`**。
2. 删除编辑器里默认的代码，将本项目根目录下 `apps-script/Code.gs` 文件中的**所有代码复制并粘贴**到编辑器中。
3. 点击顶部菜单栏中的 **`部署 (Deploy)`** -> **`新建部署 (New deployment)`**。
4. 在弹出的窗口中，点击左侧齿轮图标（选择类型），选择 **`Web 应用程序 (Web app)`**。
5. 配置以下权限参数：
   - **执行需作为 (Execute as)**：`我 (Me - 你的邮箱)`
   - **谁可以访问 (Who has access)**：`所有人 (Anyone)` **(非常重要，否则前端无法访问)**
6. 点击**部署**。*第一次部署时可能会弹出“需要授权”提示，请点击“审查权限”，选择你的 Google 账号，点击“高级(Advanced)”，然后点击“转至无标题项目（不安全）”，最后点击“允许”。*
7. 部署完成后，会生成一个 **`Web app URL`**。请**复制这个网址**。

---

## 🔗 4. 连接前端与后端

1. 回到本地的项目目录，找到 `.env` 文件。
2. 将你刚刚复制的 `Web app URL` 替换到 `VITE_GOOGLE_APP_SCRIPT_URL` 变量中，如下所示：

```env
# 你的 Google Apps Script Web App URL
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的独立ID/exec

# 通过门槛（答对几题算过关）
VITE_PASS_THRESHOLD=3

# 每次随机抽取的题目数量
VITE_QUESTION_COUNT=5
```

3. 重启前端开发服务器（`npm run dev`），在首页输入一个测试 ID（例如 `player1`），点击开始游戏！
4. 完成答题后，返回你的 Google Sheets 检查**`回答`**工作表，你应该能看到用户的成绩记录已被成功自动写入。

---

## 🌐 5. 自动部署到 GitHub Pages (可选)

本项目已配置了 GitHub Actions，当你将代码推送到 GitHub 的 `main` 或 `master` 分支时，会自动构建并部署到 GitHub Pages 供所有人在线游玩。

### 配置 GitHub Secrets (环境变量)
因为 GitHub Actions 构建时需要知道你的环境配置，你需要将 `.env.example` 中的变量填入 GitHub 的 Secrets 中才能正确打包前端静态文件。

1. 打开你的 GitHub 仓库页面。
2. 进入 **Settings** -> **Secrets and variables** -> **Actions**。
3. 点击 **New repository secret**，依次添加以下三个 Secret：
   - `VITE_GOOGLE_APP_SCRIPT_URL`：填入你的 Apps Script `/exec` 链接。
   - `VITE_PASS_THRESHOLD`：填入通过门槛，例如 `3`。
   - `VITE_QUESTION_COUNT`：填入题目数量，例如 `5`。

### 开启 GitHub Pages 功能
1. 在 GitHub 仓库的 **Settings** 页面，左侧选单点选 **Pages**。
2. 在 **Build and deployment** > **Source** 选择 **Deploy from a branch**。
3. 推送代码到 GitHub 后，Action 会自动运行并构建静态文件（此动作成功后会自动建立 `gh-pages` 分支）。
4. 在第一次 Action 执行成功后，回到 Pages 设定页。在 **Branch** 选择 **`gh-pages`** 并选择目录 **`/ (root)`**。
5. 点选 **Save**。
6. 稍等片刻，GitHub Pages 将会自动部署完成，你将得到一个形如 `https://<用户名>.github.io/<仓库名>/` 的公开游玩链接！
