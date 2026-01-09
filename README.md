# Pixel Art Quiz Game

Based on **React + Vite**, this is a retro-style Pixel Art Quiz Game. Players enter an ID, answer questions fetched from Google Sheets (or mock data), and see their results with a fun pixel art aesthetic.

## 🎮 Features

- **Pixel Art visual style**: Custom styling inspired by 2000s arcade games.
- **Dynamic Avatars**: Unique pixel art "boss" avatars for each question using DiceBear API.
- **Google Sheets Integration**: Fetch questions and submit scores to Google Sheets via Google Apps Script.
- **Responsive Design**: Playable on desktop and mobile.

## 🛠️ Tech Stack

- **Frontend Framework**: React (Vite)
- **Styling**: Vanilla CSS (Custom Pixel Art Design System)
- **Routing**: React Router DOM (HashRouter for easy static host deployment)
- **Backend**: Google Apps Script (GAS) + Google Sheets

## 🚀 Environment & Execution Requirements

### Prerequisites

- **Node.js**: Version `20.19.0+` or `22.12.0+` is recommended.
- **npm**: Comes with Node.js.

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

### Running Locally (Development)

To start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the root directory. You can use `.env.example` as a template:

```bash
cp .env.example .env
```

Configurable variables:

```env
# URL for the Google Apps Script Web App (Leave empty to use Mock Data)
VITE_GOOGLE_APP_SCRIPT_URL=

# Number of questions needed to pass
VITE_PASS_THRESHOLD=3

# Total number of questions per game
VITE_QUESTION_COUNT=5
```

## 📦 Deployment (GitHub Pages)

Autmomated deployment is configured via **GitHub Actions**.

### 1. Setup Secrets & Variables
Go to your GitHub Repository Settings > **Secrets and variables** > **Actions**.

**Repository Secrets** (For sensitive/dynamic URLs):
- `VITE_GOOGLE_APP_SCRIPT_URL`: Your Google Apps Script Web App URL.

**Repository Variables** (For game configuration, optional):
- `VITE_PASS_THRESHOLD` (Default: 3)
- `VITE_QUESTION_COUNT` (Default: 5)

### 2. Enable GitHub Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.

### 3. Deploy
Push your code to the `main` branch. The Action will automatically build and deploy the game.
