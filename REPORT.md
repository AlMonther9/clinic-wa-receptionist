# Clinic Management MVP & AI WhatsApp Receptionist Agent - Technical Report

This report outlines the design, architecture, implementation pipeline, and validation guide for the **Clinic Management MVP** and its integrated **Autonomous AI WhatsApp Receptionist Agent**.

---

## 1. Executive Summary

This MVP is a unified, high-performance, and resilient medical coordination system designed to reduce administrative overhead for clinical receptionists while providing patients with 24/7 automated scheduling and query answering. 

The architecture is built natively on **Next.js (App Router)** and **Prisma ORM with PostgreSQL**, combining both internal and public layers into a single deployment unit:
1. **Internal Receptionist Dashboard (`/dashboard`):** A modern, keyboard-friendly command center optimized for instant scheduling lookups, doctor attendance check-ins, and automated monthly presence reporting.
2. **Autonomous AI WhatsApp Router (`/api/v1/whatsapp`):** A serverless webhook route that intercepts messages from the Meta WhatsApp Cloud API, queries the relational database, formats live schedule context, prompts a language model (OpenAI/Gemini) to respond politely in the Egyptian Arabic dialect (without markdown formatting issues), and dispatches the reply back via Meta's Graph API.

### Why this Architecture is Optimal for an MVP:
- **Zero-Bridges Monolith:** Both the dashboard client, database query layer, and webhook endpoints share the same codebase. Type safety is maintained end-to-end, and there are no external synchronization queues.
- **Serverless & Edge-Ready:** Next.js Route Handlers scale down to zero when idle, minimizing operating costs for Meta webhooks.
- **Resilient AI Providers:** The AI layer features automatic fallback: if OpenAI credentials fail or are missing, it attempts to use Google Gemini, and falls back to a friendly static message if both are unavailable.

---

## 2. What's Done & Working Checklist

The codebase is fully implemented, typed, and successfully compiled. Here is the operational checklist:

- [x] **Database Schema & Models:** Relational models for `Doctor`, `Schedule` (indexed by doctor and day of week), and `TimeSheet` (attendance statuses, unique constraints per doctor/day, indexed by date).
- [x] **Database Seeder (`prisma/seed.ts`):** Complete script seeding demo doctors across multiple specialties (Orthopedics, Internal Medicine, Pediatrics, Dermatology), sample schedules, and weekly attendance logs.
- [x] **GET Webhook Verification Handshake:** Safe handler validating verification tokens against the secure environment parameter (`META_VERIFY_TOKEN`) and returning the Meta challenge token.
- [x] **POST Webhook Processing:** Real-time JSON parser extracting user phone number (`from`) and text body, filtering out non-text payloads (like read status receipts) to avoid wasteful LLM invocations.
- [x] **Relational AI Context Construction:** Dynamic SQL compiler compiling all doctors and active schedule slots into a structured text prompt for the LLM.
- [x] **Egyptian Arabic LLM Processor:** Custom prompt styling the AI to speak in Egypt's polite dialect (using "حضرتك" and "يا فندم"), enforcing a maximum response size (3-4 lines), and purging markdown elements (stripping `**` and `*`) to maintain pure text clarity on WhatsApp.
- [x] **Meta Graph API Client Dispatcher:** Fetch request posting payload responses to the Meta Graph API (`v18.0`) targeting the sender's phone number ID.
- [x] **Instant Filter Matrix UI:** React interface with text search, specialty filter pills, and weekly day filters matching doctor records.
- [x] **Spotlight Command Palette (`Ctrl + K`):** Global keyboard listener opening a fast spotlight modal overlay allowing keyboard navigation (arrows, Enter) to instantly search doctor profiles, schedules, or register doctor check-ins.
- [x] **Daily Attendance Ledger:** Comprehensive check-in/out console calculating total days present during the current month automatically.
- [x] **Interactive Data Management:** Interactive Modals enabling the direct addition of new doctors and schedule configurations.

---

## 3. Data Flow & Execution Pipelines

The system manages communications through two primary pipelines:

### A. WhatsApp Messaging to AI Response Pipeline

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
    Webhook->>Webhook: Extracts sender wa_id and message body
    Webhook->>DB: Queries doctors & weekly schedules
    DB-->>Webhook: Returns active schedule array
    Webhook->>Webhook: Formats schedules & system prompt (Egyptian Arabic, No Markdown)
    Webhook->>LLM: Dispatches prompt context
    LLM-->>Webhook: Returns polite response text
    Webhook->>Webhook: Sanitizes response (strips markdown formatting)
    Webhook->>Meta: Dispatches Meta Graph API POST request
    Meta-->>Patient: Delivers clean text message
```

### B. Attendance Check-In & Monthly Presence Pipeline

```mermaid
flowchart TD
    A[Receptionist Dashboard] -->|Selected Date changed| B(Server Action: getClinicDashboardData)
    B -->|Query 1| C[(Doctors & Schedules)]
    B -->|Query 2| D[(Timesheets for Selected Day)]
    B -->|Query 3| E[(Count PRESENT statuses for Current Month)]
    C & D & E --> F[Format dashboard view]
    F --> A
    
    A -->|Clicks Check-In / Check-Out| G(Server Action: checkInDoctor / checkOutDoctor)
    G -->|Prisma Upsert / Update| H[(TimeSheet Table)]
    H -->|RevalidatePath| A
```

---

## 4. Environment Variables Configuration

To run this application, create a `.env` file in the root directory:

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

---

## 5. Validation & Testing Guide

You can test both the webhook receiver and the AI routing locally or in staging using the following `cURL` commands.

### Test A: Meta Webhook GET Handshake (Verification)

Meta will verify your webhook by making a GET request with query parameters. Run this command to simulate Meta's verification check:

```bash
curl -G "http://localhost:3000/api/v1/whatsapp" \
  --data-urlencode "hub.mode=subscribe" \
  --data-urlencode "hub.verify_token=your_custom_secure_webhook_token" \
  --data-urlencode "hub.challenge=test_challenge_code_12345"
```

**Expected Response:**
- Status Code: `200 OK`
- Body (Plain Text): `test_challenge_code_12345`

---

### Test B: WhatsApp Message Webhook (POST)

Simulate an incoming text message from a patient (e.g. asking for Dr. Ahmed's schedule) by firing a mock JSON payload:

```bash
curl -X POST "http://localhost:3000/api/v1/whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [
      {
        "id": "1234567890",
        "changes": [
          {
            "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                "display_phone_number": "15550000000",
                "phone_number_id": "1234567890"
              },
              "contacts": [
                {
                  "profile": {
                    "name": "Ahmed Test"
                  },
                  "wa_id": "201012345678"
                }
              ],
              "messages": [
                {
                  "from": "201012345678",
                  "id": "wamid.HBgLMTU1NTU1NTU1NTUVQzk4...",
                  "timestamp": "1675713496",
                  "text": {
                    "body": "مواعيد دكتور احمد عظام امتى لو سمحت؟"
                  },
                  "type": "text"
                }
              ]
            },
            "field": "messages"
          }
        ]
      }
    ]
  }'
```

**Expected Response:**
- Status Code: `200 OK`
- Body (JSON):
```json
{
  "status": "success",
  "recipient": "201012345678",
  "message": "أهلاً بحضرتك يا فندم. دكتور أحمد سليمان تخصص عظام متواجد في العيادة يوم الاثنين والأربعاء من الساعة 14:00 إلى 18:00 في غرفة 101. تحت أمر حضرتك في أي وقت!"
}
```

*(Note: If Meta credentials are not set in the `.env` file, the webhook will complete successfully and print the response to the terminal console to avoid API errors, making local offline testing clean and seamless.)*
