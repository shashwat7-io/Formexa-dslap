# FORMEXA - dslap ⚡
### Real-Time High-Precision AI Gym Form & Posture Analyzer

**FORMEXA - dslap** is an AI computer-vision application tracking body technique in real time via webcam. Powered by **Google MediaPipe Heavy 3D Pose Tracking (Complexity 2)**, 3D spatial vector math, and strict biomechanical rules, it automatically classifies exercises, scores form quality, highlights posture faults directly on your live camera video stream, and provides hands-free audio voice coaching.

---

## ⚡ Render.com Deployment (Recommended)

This repository is optimized for **1-Click Deployment on Render.com** via the included `render.yaml` blueprint.

### Method A: 1-Click Render Deployment (Blueprint)
1. Push this repository to **GitHub**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Select your `formexa-dslap` repository.
5. Render will automatically detect `render.yaml`, run `npm install && node build.js`, and deploy your live app with free HTTPS!

### Method B: Render Web Service (Manual)
If creating a Web Service manually on Render:
- **Environment**: `Node`
- **Build Command**: `npm install && node build.js`
- **Start Command**: `node server.js`
- **Port**: Handled automatically via `process.env.PORT`

---

## 📂 Project Structure

```
gymguard-ai/
├── render.yaml                # 1-Click Render Blueprint deployment spec
├── server.js                  # Express static server for Render deployment
├── build.js                   # Fail-safe zero-error Render build script
├── standalone.html            # Self-contained single-file app bundle
├── index.html                 # Main Vite entry html
├── package.json               # Package dependencies & scripts
├── vite.config.ts             # Vite configuration
└── src/                       # React + TypeScript source code
```

---

## 🚀 Local Commands

```bash
# Navigate to directory
cd gymguard-ai

# Test Render server locally
npm start

# Test Vite development server
npm run dev
```
