# 🛡️ FUTURE_CS_02 — Phishing Email Detection & Awareness System

![Cybersecurity](https://img.shields.io/badge/Security-Phishing%20Detection-00c8ff?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Live-00ff88?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Base44-7c3aed?style=for-the-badge)

> A full-stack cybersecurity platform for detecting phishing emails using AI-powered analysis, security awareness training, and real-time threat classification.

---

## 🚀 Live Demo

🔗 **[https://cyber-guard-app-a1c12821.base44.app](https://cyber-guard-app-a1c12821.base44.app)**

---

## 📸 Features

| Page | Description |
|------|-------------|
| 🏠 **Landing Page** | Animated particle hero, stats, feature overview |
| 🔐 **Login / Register** | Full authentication with password strength meter |
| 📊 **Dashboard** | Live stats, recent analyses, quick action buttons |
| 🔍 **Email Analyzer** | AI-powered phishing detection with risk scoring |
| 🔬 **Header Inspector** | SPF / DKIM / DMARC header analysis |
| 🎓 **Awareness** | 8 phishing techniques, red flags, real examples |
| 📋 **Guidelines** | DO / DON'T security rules, emergency response |
| 📋 **Reports** | Full history with filters, search, expandable details |

---

## 🧠 Detection Engine

The AI analyzer detects:

- ✅ Typosquatted / fake sender domains
- ✅ Urgency and threatening language
- ✅ Generic greetings (`Dear User`, `Dear Customer`)
- ✅ Shortened URLs (`bit.ly`, `tinyurl`, etc.)
- ✅ IP-based links and missing HTTPS
- ✅ Password / OTP / credential harvesting requests
- ✅ Attachment delivery threats
- ✅ Malicious script injection

### Risk Classification

| Level | Score | Color |
|-------|-------|-------|
| 🟢 SAFE | 0–24 | Green |
| 🟡 SUSPICIOUS | 25–59 | Yellow |
| 🔴 PHISHING | 60–100 | Red |

---

## 🛠️ Tech Stack

- **Frontend:** React (JSX), CSS-in-JS, HTML5 Canvas animations
- **Backend:** Base44 managed backend
- **Database:** Base44 Entities (cloud database)
- **Auth:** localStorage-based session management
- **AI Detection:** Custom rule-based phishing analysis engine

---

## 📁 Project Structure

```
pages/
├── Home.jsx          # Landing page with particle animation
├── Login.jsx         # User authentication
├── Register.jsx      # User registration
├── Dashboard.jsx     # Security dashboard
├── Analyzer.jsx      # Email & header analyzer
├── Awareness.jsx     # Phishing education
├── Guidelines.jsx    # Security guidelines
└── Report.jsx        # Analysis history & reports
```

---

## 🚀 Getting Started

This project is deployed on Base44. To run locally or fork:

1. Clone the repository:
   ```bash
   git clone https://github.com/nifras19/FUTURE_CS_02.git
   ```
2. Open `pages/` — each `.jsx` file is a standalone React page
3. Deploy on [Base44](https://base44.com) or adapt to your own React setup

---

## 🔒 Security Notice

This tool is for **educational and awareness purposes**. It demonstrates phishing detection techniques to help users identify and avoid email-based threats.

---

## 📜 License

MIT License — feel free to use, modify, and distribute.

---

*Built with ❤️ using [Base44](https://base44.com) — AI-powered app platform*
