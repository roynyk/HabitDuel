# 🔥 HabitDuel — Fullstack Multiplayer Habit Tracker

A modern, high-performance **Multiplayer Habit Tracker Application** designed to turn daily habits into engaging social duels. Built with an ultrafast **Hono JS** backend, **React**, **Prisma ORM**, and **Supabase PostgreSQL & Storage**.

![HabitDuel Tech Stack](https://img.shields.io/badge/Backend-Hono_JS-orange?style=for-the-badge&logo=hono)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)
![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-emerald?style=for-the-badge&logo=supabase)
![ORM](https://img.shields.io/badge/ORM-Prisma-indigo?style=for-the-badge&logo=prisma)
![Frontend](https://img.shields.io/badge/Frontend-React_Vite_Tailwind-cyan?style=for-the-badge&logo=react)

---

## ✨ Key Features

- ⚡ **Ultrafast Hono JS REST API**: Engineered with Hono JS for ultra-low latency (~2,200+ requests/sec benchmarked with Autocannon).
- 📸 **Supabase Storage Integration**: Real-time image upload & permanent asset hosting for daily proof check-ins.
- ⏱️ **Flexible Calendar & Hourly Time Picker**: Custom 24-hour deadline selectors (`<input type="time" />`) and custom calendar challenge durations (7, 14, 30, 60, 90, 365 days).
- 🔥 **Strict Daily Check-In & Streak Engine**: Enforces a strict 1x check-in limit per calendar day per room, featuring dynamic `🔥 Active` and `💤 Inactive` status badges.
- 👑 **Gamified Roles & Sole Leaderboard**: 
  - **`👑 Owner`**: Displays creator badges across room cards, metrics, and member lists.
  - **`🏆 Top Frag`**: Grants crown badges exclusively when a single member strictly leads the streak leaderboard (>0 streak).
- ✏️ **Interactive Feed & Post Editing**: Edit proof captions/notes or re-upload new proof photos directly from the Live Feed.
- 🎨 **Warm Brown Soft Parchment Design**: Styled with a curated `#F2F0EA` parchment aesthetic and fluid responsive components.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Hono JS (`@hono/node-server`)
- **Language**: TypeScript
- **Database & ORM**: Supabase PostgreSQL & Prisma ORM
- **Storage**: Supabase Storage Bucket (`proofs`)
- **Authentication**: JWT & Bcrypt Password Hashing

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/roynyk/HabitDuel.git
cd HabitDuel
