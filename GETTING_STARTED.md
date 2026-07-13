# Setup & Credentials Guide (Getting Started)

This guide walks you through acquiring all credentials needed for the **Clinic WhatsApp Agent MVP** and running it locally.

---

## 1. Credentials Acquisition Guide

### A. PostgreSQL Database URL (Neon)
**Neon** is a serverless PostgreSQL platform. It is highly recommended for MVPs due to its fast cold starts and autoscaling.
1. Go to [neon.tech](https://neon.tech/) and sign up for a free account (no credit card required).
2. Click **Create Project**, name it (e.g., `clinic-mvp`), and select your preferred region.
3. In the Neon Console Dashboard, copy the connection string from the **Connection Details** box. It will look like this:
   `postgresql://neondb_owner:PASSWORD@ep-xyz-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Replace `DATABASE_URL` in your `.env` file with this string.
- **Cost:** **Free** (Generous free tier includes 1 project, 10 branches, and 3GB of storage, which is more than enough for this MVP).

---

### B. OpenAI API Key
1. Visit the [OpenAI Developer Platform](https://platform.openai.com/).
2. Create an account or sign in.
3. Navigate to **API Keys** in the left sidebar and click **Create new secret key**.
4. Copy the key immediately (it looks like `sk-proj-...`) and save it to `OPENAI_API_KEY`.
- **Cost:** **Paid** (New accounts may receive small free trial credits, but generally you must load a minimum of **$5 USD** onto your billing profile under **Settings > Billing** to activate API access).

---

### C. Gemini API Key (Google AI Studio)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with any Google account.
3. Click the **Get API key** button in the top left.
4. Click **Create API key**, select a project, and copy the generated key.
5. Save it to `GEMINI_API_KEY` in your `.env` file.
- **Cost:** **Free** (The Gemini API has a generous free tier of up to **15 RPM** (Requests Per Minute) and **1.5 Million TPM** (Tokens Per Minute) on models like `gemini-2.5-flash`, which is perfect for developer testing without incurring any charges).

---

### D. Meta WhatsApp Cloud API Credentials
To set up WhatsApp Business Cloud API, you need a Meta Developer Account:
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/) and register.
2. Click **My Apps** > **Create App**. Select **Other** > **Business** as the app type, and fill in the details.
3. Scroll down in the App Dashboard and click **Set up** next to **WhatsApp**.
4. In the left navigation, open **WhatsApp** > **API Setup**:
   - **Temporary Access Token:** Copy this token. *(Note: This token expires in 24 hours. For production, you must generate a Permanent System User Token via your Meta Business Suite).* Set this as `META_ACCESS_TOKEN`.
   - **Phone Number ID:** Copy the number string listed under "Phone number ID" (not the account ID). Set this as `META_PHONE_NUMBER_ID`.
5. Go to **WhatsApp** > **Configuration** in the sidebar:
   - Click **Edit** under **Webhook**.
   - **Callback URL:** Once your app is deployed online (via Vercel or tunnel), enter `https://your-domain.com/api/v1/whatsapp`.
   - **Verify Token:** Enter a custom secure string of your choice (e.g., `my_secure_token_123`). This must match `META_VERIFY_TOKEN` in your `.env`.
   - Under **Webhook Fields**, click **Manage** and subscribe to **messages**.

- **Cost:** **Free** (The Meta WhatsApp Business API allows **1,000 free conversation sessions per month** for every WhatsApp Business Account. This includes both user-initiated and assistant-initiated chats. Beyond 1,000 chats/month, you pay micro-cents per conversation, depending on category and user country).

---

## 2. Using Your Own WhatsApp Business Number vs. Sandbox

When you set up WhatsApp Cloud API, Meta automatically provisions a **"Test Phone Number"** (a US-based number like `+1 555-xxx-xxxx`). 

### Can I use my own WhatsApp Business phone number for testing and then disconnect it?
**Yes, but with critical caveats:**

1. **The Sandbox Limit:** The default test number is free, sandboxed, and can only send messages to up to **5 verified recipient numbers** (which you must manually verify in the Developer Console by entering verification codes).
2. **Registering your Real Number:** You can add your own active business or personal number in the Meta Developer Console under **API Setup > Add Phone Number**. 
3. **The Lock-In Risk (Crucial):** Once you register a phone number in the Meta WhatsApp Cloud API, **it is locked to the API. You can NO LONGER use that same number on the standard consumer WhatsApp app or the WhatsApp Business mobile app.** If someone opens the app on your phone, they will be logged out.
4. **Disconnecting/Reverting:** If you want to use the number back on your mobile app, you must **completely delete the phone number from your Meta Business Manager** under WhatsApp Accounts. Once deleted, you can re-register the number on your phone's WhatsApp app. However:
   - All message histories stored on the phone from before will be lost during the re-registration cycle.
   - Any chats handled by the AI while on the API will not sync back to your phone.
5. **Recommendation:** For testing, stick strictly to the **Meta Test Phone Number** or buy a **cheap, separate SIM card** (costing very little) to act as your dedicated API number. Avoid using your personal or primary clinic phone number for developer testing.

---

## 3. Running the App Locally in 3 Steps

Follow these steps to run the workspace code on your local computer:

### Step 1: Install Dependencies
Open your terminal in the project directory and install the packages:
```bash
npm install
```

### Step 2: Push Database Schema & Seed Data
Ensure your `.env` contains your Neon `DATABASE_URL`. Run the database push command to build the tables on PostgreSQL, followed by the database seeder to populate the demo doctors:
```bash
# Push database structure
npx prisma db push

# Seed mock doctors & schedules
npx prisma db seed
```

### Step 3: Run the Local Dev Server
Fire up the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the receptionist panel.

---

## 4. Local Webhook Routing (For Receiving WhatsApp Messages Locally)
Since Meta cannot send webhooks to `localhost:3000`, you must create a public tunnel to test the WhatsApp chatbot locally:
1. Download [ngrok](https://ngrok.com/) or use `localtunnel`.
2. Start a tunnel pointing to your dev port:
   ```bash
   npx localtunnel --port 3000
   # or
   ngrok http 3000
   ```
3. Copy the secure public URL generated (e.g. `https://xyz.localltunnel.me`).
4. Go to your Meta App Dashboard > **WhatsApp > Configuration**, click **Edit Webhook**, and save:
   - **Callback URL:** `https://xyz.localltunnel.me/api/v1/whatsapp`
   - **Verify Token:** `your_custom_secure_webhook_token` (as defined in `.env`)
5. Send a WhatsApp message to your Meta Test Number. The message will route through your local server, hit Neon/Gemini, and return the response!
