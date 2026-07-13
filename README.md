# 🏥 Clinic WA Receptionist (Clinic Management MVP & AI WhatsApp Agent)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Meta API](https://img.shields.io/badge/WhatsApp_Cloud_API-v18.0-25D366?style=flat-square&logo=whatsapp)](https://developers.facebook.com/)
[![AI Engine](https://img.shields.io/badge/LLM-OpenAI%20%2F%20Gemini-orange?style=flat-square&logo=openai)](https://platform.openai.com/)

A modern, high-performance medical coordination MVP that unites an **Internal Receptionist Dashboard** with an **Autonomous AI WhatsApp Receptionist** in a single serverless-ready Next.js monolith. 

The agent handles 24/7 patient scheduling inquiries directly on WhatsApp using live doctor timetables queried from a relational database, replying in polite **Egyptian Arabic dialect** with clean, plain-text formatting (sanitized of Markdown).

---

## 🌟 Key Features

### 1. 🤖 Autonomous WhatsApp Agent (`/api/v1/whatsapp`)
*   **Live DB-Context Integration:** Dynamically compiles active doctor schedules, specialties, and presence states into the prompt before query processing.
*   **Dual LLM Engine with Auto-Fallback:** Resiliently queries OpenAI GPT-4o/GPT-3.5; if credentials are missing or exceed limits, it automatically falls back to Google Gemini, and finally to a static template message if both are offline.
*   **Egypt-Localized Dialect (المصري):** Fine-tuned prompt guidelines direct the LLM to speak in Egypt's polite, conversational clinic dialect (using `"حضرتك"` and `"يا فندم"`).
*   **Plain Text Sanitizer:** Automatically strips out markdown elements (like asterisks `*` or bold markers `**`) that render awkwardly or break formatting on Meta WhatsApp Cloud API.

### 2. 🖥️ Receptionist Dashboard (`/dashboard`)
*   **Spotlight Command Palette (`Ctrl + K`):** Interactive global search and command launcher allowing rapid keyboard navigation (arrow keys + Enter) to find doctors, view schedules, or toggle attendance.
*   **Live Attendance Ledger:** Daily check-in/out ledger that computes doctor workdays and automatically aggregates monthly attendance figures.
*   **Dynamic Specialty Filter Matrix:** Quick-filter pill grid supporting search filters and weekly schedule alignments.
*   **Admin Management Modals:** Add new doctors, define multi-day schedules, and review operational metrics in real-time.

---

## 📐 System Architecture

### WhatsApp Message-to-AI Dispatch Flow

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient (WhatsApp)
    participant Meta as Meta Graph API
    participant Webhook as Next.js Webhook (/api/v1/whatsapp)
    participant DB as PostgreSQL (Prisma)
    participant LLM as LLM Engine (OpenAI / Gemini)

    Patient->>Meta: Sends text query (e.g. "عايز أحجز كشف عظام")
    Meta->>Webhook: Relays Webhook JSON Payload (POST)
    Webhook->>Webhook: Extracts sender phone number & message body
    Webhook->>DB: Queries doctors & weekly schedules
    DB-->>Webhook: Returns active schedule array
    Webhook->>Webhook: Formats schedules & system prompt (Egyptian Arabic, No Markdown)
    Webhook->>LLM: Dispatches prompt context
    LLM-->>Webhook: Returns polite response text
    Webhook->>Webhook: Sanitizes response (strips markdown formatting)
    Webhook->>Meta: Dispatches Meta Graph API POST request
    Meta-->>Patient: Delivers clean text message
```

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 16 (App Router, Server Actions)
*   **Language:** TypeScript
*   **Database ORM:** Prisma Client & Migrations
*   **Database Engine:** PostgreSQL (Optimized for Neon Serverless Postgres)
*   **Styling:** Tailwind CSS v4 & Lucide Icons
*   **AI Integration:** `@google/genai` SDK & `openai` SDK

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (see `.env.example`):
```env
# Relational Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/clinic_db?schema=public"

# LLM Providers Configuration (Define at least one)
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."

# Meta WhatsApp Cloud API Credentials
META_VERIFY_TOKEN="your_custom_secure_webhook_token"
META_ACCESS_TOKEN="EAAm..."
META_PHONE_NUMBER_ID="1234567890..."
```

### 3. Build & Seed Database
Push the relational schema structure directly to your database and seed it with demo clinical schedules:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to load the receptionist portal.

---

## 📡 Local Webhook Testing
To receive live webhooks from Meta on your local environment:
1. Run a local tunnel using `ngrok` or `localtunnel`:
   ```bash
   npx localtunnel --port 3000
   ```
2. Copy the secure public URL generated (e.g. `https://xyz.localtunnel.me`).
3. Set your Callback URL in the **Meta App Dashboard > WhatsApp > Configuration**:
   - **Callback URL:** `https://xyz.localtunnel.me/api/v1/whatsapp`
   - **Verify Token:** Must match `META_VERIFY_TOKEN` in your `.env`.
4. Subscribe to the `messages` webhook field.

---

## 📄 Documentation

For deep dives into credentials, deployment, and operation, refer to the local markdown guides:
*   [Setup & Credentials Guide (GETTING_STARTED.md)](./GETTING_STARTED.md) — Detailed instructions on getting Neon database strings, LLM keys, and Meta credentials.
*   [Technical Architecture & Report (REPORT.md)](./REPORT.md) — Deep architectural explanations and cURL testing tools.
*   [Deployment Guide (DEPLOYMENT_GUIDE.md)](./DEPLOYMENT_GUIDE.md) — Steps for production deployments on Vercel or VPS environments.

---

## 📝 License
This project is licensed under the MIT License.
