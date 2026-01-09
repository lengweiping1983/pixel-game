# Pixel Art 像素风闯关问答游戏

这是一个基于 **React + Vite** 构建的复古像素风格问答游戏。玩家输入 ID 后，系统会从 Google Sheets 获取题目（或使用 Mock 数据），玩家需要在像素风的界面中挑战关卡，并最终将成绩记录回 Google Sheets。

## 🎮 功能特性

- **像素艺术风格**：致敬 2000 年代街机游戏的视觉设计。
- **动态 Boss 头像**：每一题都会通过 DiceBear API 生成独特的像素风 Boss。
- **Google Sheets 集成**：使用 Google Sheets 作为后台数据库，管理题目并存储玩家成绩。
- **响应式设计**：支持桌面端与移动端游玩。

## 🛠️ 技术栈

- **前端框架**: React (Vite)
- **样式**: Vanilla CSS (自定义像素风设计系统)
- **路由**: React Router DOM (使用 HashRouter 以适配静态部署)
- **后端**: Google Apps Script (GAS) + Google Sheets

## 🚀 本地开发指南

### 环境要求

- **Node.js**: 推荐版本 `20.19.0+` 或 `22.12.0+`。
- **npm**: 随 Node.js 安装。

### 安装步骤

1. 克隆项目到本地。
2. 安装依赖：

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`。

### 环境变量配置

在项目根目录复制 `.env.example` 创建 `.env` 文件：

```bash
cp .env.example .env
```

配置说明：

```env
# Google Apps Script Web App 链接 (填入部署后的 URL，留空则使用本地 Mock 数据)
VITE_GOOGLE_APP_SCRIPT_URL=

# 通过门檻 (答对几题算过关)
VITE_PASS_THRESHOLD=3

# 每次游戏的题目数量
VITE_QUESTION_COUNT=5
```

---

## ☁️ 后端配置指南 (Google Sheets & Apps Script)

本游戏使用 Google Sheets 及其内嵌的 Apps Script (GAS) 作为后端 API。请按照以下步骤配置：

### 1. 创建 Google Sheets

新建一个 Google Sheet，并创建两个工作表（Tab）：

**工作表 1：`Questions` (题目表)**
请严格按照以下顺序设置首行标题（Header）：
`ID` | `Question` | `OptionA` | `OptionB` | `OptionC` | `OptionD` | `Answer`
--- | --- | --- | --- | --- | --- | ---
1 | 1+1=? | 1 | 2 | 3 | 4 | B

**工作表 2：`Results` (成绩表)**
设置首行标题：
`ID` | `Score` | `Total` | `Passed` | `Time(s)` | `Date` (会自动记录时间)

### 2. 配置 Google Apps Script

1. 在 Google Sheet 菜单栏点击 **扩展程序 (Extensions)** > **Apps Script**。
2. 清空 `Code.gs` 的内容，粘贴以下代码：

```javascript
const SHEET_QUESTIONS = "Questions";
const SHEET_RESULTS = "Results";

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  if (action === "getQuestions") {
    return getQuestions(params.count);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "submitResult") {
      return submitResult(data);
    }
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getQuestions(count) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift(); // Remove header
  
  // 简单随机抽取 (Shuffle)
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count || 5);
  
  const questions = selected.map((row, index) => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    },
    answer: row[6],
    seed: "boss-" + Math.floor(Math.random() * 1000) // 随机生成 Boss 头像种子
  }));
  
  return ContentService.createTextOutput(JSON.stringify(questions)).setMimeType(ContentService.MimeType.JSON);
}

function submitResult(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_RESULTS);
  // ID, Score, Total, Passed, Time, Timestamp
  sheet.appendRow([
    data.id,
    data.score,
    data.totalQuestions,
    data.passed,
    data.duration,
    new Date()
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. 部署 API

1. 点击右上角 **部署 (Deploy)** > **新建部署 (New deployment)**。
2. 点击左侧齿轮选择类型：**Web 应用 (Web app)**。
3. 配置如下：
   - **说明 (Description)**: Pixel Game API
   - **执行身份 (Execute as)**: **我 (Me)**
   - **谁可以访问 (Who has access)**: **任何人 (Anyone)** (重要！否则前端会出现 CORS 错误或需要登录)
4. 点击 **部署 (Deploy)**。
5. 复制生成的 **Web App URL**。
6. 将此 URL 填入本地项目的 `.env` 文件中的 `VITE_GOOGLE_APP_SCRIPT_URL` 字段。

---

## 📦 部署指南 (GitHub Pages)

本项目已配置 GitHub Actions 自动部署流程。

### 1. 配置 GitHub Secrets

在 GitHub 仓库页面，进入 **Settings** > **Secrets and variables** > **Actions**。

**Repository Secrets** (用于敏感信息):
- `VITE_GOOGLE_APP_SCRIPT_URL`: 填入你的 Google Apps Script URL。

**Repository Variables** (用于公开配置):
- `VITE_PASS_THRESHOLD` (默认: 3)
- `VITE_QUESTION_COUNT` (默认: 5)

### 2. 启用 GitHub Pages

1. 进入 **Settings** > **Pages**。
2. 在 **Build and deployment** 下，选择 Source 为 **GitHub Actions**。

### 3. 触发部署

## ❓ 常见问题 (Troubleshooting)

### Google Apps Script 授权警告
如果在初次运行或部署时看到 **"Google hasn’t verified this app" (Google 未验证此应用)** 的警告：

1. 不需要惊慌，这是因为你使用的脚本是自己创建的，且没有提交给 Google 审核（个人自用无需审核）。
2. 点击左下角的 **"Advanced" (高级)** 链接。
3. 点击底部的 **"Go to {Project Name} (unsafe)" (前往... (不安全))**。
4. 在接下来的页面点击 **"Allow" (允许)** 即可。

