# Deployment Strategy & Hosting Guide

This guide details the deployment options for the **Clinic Management MVP**, including cloud hosts (Vercel, Hostinger) and running it locally on a physical clinic PC, outlining the requirements, trade-offs, and critical uptime rules.

---

## 1. Hosting Architecture & Options

Next.js App Router applications require a Node.js-compatible environment to handle server-side actions, page requests, and the `/api/v1/whatsapp` API route. 

| Deployment Type | Provider | Cost (Est) | Ease of Setup | Reliability / Uptime | Recommended? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cloud Serverless** | Vercel (Hobby) | Free | Very Easy | 99.99% | **Yes (Best for Webhook)** |
| **Cloud Virtual Server (VPS)** | Hostinger (VPS) | $5 - $10/mo | Medium | 99.9% | Yes (For custom domain/control) |
| **On-Premise (Local PC)** | Clinic Computer | Free | Hard | Low | No (Only if strictly intranet) |

---

## 2. Does the App Need Dockerization?

**No, Dockerization is optional but not strictly required.**
- **Without Docker (Standard Node.js):** You can build and deploy the Next.js app directly on any environment that supports Node.js 18+ (Vercel, Hostinger VPS, or local computer) by executing `npm run build` and `npm run start`.
- **With Docker:** Dockerization is useful if you are deploying to a containerized platform (like AWS ECS, Google Cloud Run, or Coolify on VPS). It guarantees that environment configurations and Node version matching are locked in. 
  - *Recommendation:* Since this is an MVP, deploy directly using standard Node.js to keep setups lightweight and bypass container orchestration overhead.

---

## 3. How to Deploy on Hostinger

Hostinger offers both Shared Web Hosting and Virtual Private Servers (VPS).
> [!IMPORTANT]
> **Do not use Hostinger Shared Hosting.** Standard Shared Hosting is built primarily for static files and PHP (WordPress). To run Next.js server logic and API routes, you **must use a Hostinger VPS plan** running Linux (Ubuntu recommended).

### Step-by-Step Hostinger VPS Deployment:
1. **Purchase VPS:** Buy a basic VPS plan on Hostinger (e.g., VPS 1 with Ubuntu 22.04 LTS).
2. **Install Node.js & Git:** SSH into your VPS terminal and install Node.js:
   ```bash
   sudo apt update
   sudo apt install -y git curl
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. **Install PM2 (Process Manager):** PM2 runs your Next.js application in the background and restarts it automatically if the server crashes or reboots:
   ```bash
   sudo npm install -g pm2
   ```
4. **Clone & Setup Environment:**
   - Clone your project directory onto the server: `git clone <your-repo-link>`
   - Navigate to the directory: `cd clinic-whatsapp-agent`
   - Create a production `.env` file containing your Neon database URL, OpenAI/Gemini keys, and Meta credentials: `nano .env`
5. **Build & Start the Next.js Server:**
   - Install packages: `npm install`
   - Generate Prisma Client: `npx prisma generate`
   - Build Next.js bundle: `npm run build`
   - Start using PM2: `pm2 start npm --name "clinic-app" -- start`
   - Set PM2 to startup automatically on server reboot: `pm2 startup` and `pm2 save`
6. **Configure Nginx Reverse Proxy:** Install Nginx to map incoming web traffic from port 80/443 (HTTP/HTTPS) to Next.js's internal port (3000):
   - Install: `sudo apt install nginx`
   - Configure a server block directing traffic from your domain to `http://localhost:3000`.
   - Setup free SSL certificates using **Let's Encrypt Certbot**: `sudo apt install certbot python3-certbot-nginx && sudo certbot --nginx`

---

## 4. Running Locally on the Clinic's Computer (On-Premise)

It is technically possible to turn a physical desktop computer in the clinic into a server by installing Node.js, running the app locally, and using a port-forwarding tunnel (like ngrok, Cloudflare Tunnels, or localtunnel) to expose the webhook to Meta.

### Advantages:
- **Zero Hosting Fees:** No monthly VPS or cloud hosting bills.
- **Physical Control:** All files and local network interfaces are physically situated inside the clinic.

### Risks (Major):
1. **Dynamic IP & Tunnel Stability:** Clinical internet plans usually have dynamic IPs. If the router reboots, the public tunnel URL changes, breaking the WhatsApp Webhook callback URL configured in the Meta developer portal.
2. **Hardware/Power Outages:** If the clinic PC is shut down at night, enters sleep mode, or loses power, the AI agent instantly goes offline.
3. **No Redundancy or Backups:** Unlike cloud hosting (Vercel/Neon) which has automatic hardware failovers and daily database snapshot backups, a local hardware crash or hard-drive failure can permanently corrupt your schedules and attendance sheets.
4. **Security Vulnerability:** Exposing a local clinic computer to the open internet via tunnels poses a potential entryway for attackers into the clinic's local area network (LAN).

---

## 5. The 24/7 Online Requirement for WhatsApp

### Do we need to be online 24/7?
**Yes. The AI WhatsApp Webhook must run 24 hours a day, 7 days a week.**

### Why?
1. **Immediate Delivery Expectations:** Patients can message the clinic at any time (late at night, weekends, holidays). If they text and the server is offline, they receive no response, creating a poor patient experience.
2. **Meta Webhook Retry Protocol:** When a patient sends a message, Meta's servers attempt to hit your Next.js webhook route immediately. If your server is offline (returning a timeout or a 502/504 error):
   - Meta will retry sending the webhook message periodically with exponential backoff for **up to 24 hours**.
   - During this time, the queue builds up. Once your local PC turns back on, it will be flooded with old messages, causing the LLM to reply to questions that were sent hours ago, which is confusing for the patient.
   - If your server remains offline for more than 24 hours, Meta drops the messages, and your webhook configuration in the Meta Developer Console may be **temporarily disabled** or flagged for failing health checks.

### Recommendation
**Deploy the Next.js code to Vercel (which has a 100% free serverless tier with 99.99% uptime) and keep your PostgreSQL database on Neon.** This ensures the AI reception route is always active 24/7 to catch and answer incoming messages instantly, while the receptionist at the clinic can access the `/dashboard` UI during business hours from any browser.
