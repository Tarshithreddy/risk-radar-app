# 🚨 AI Customer Risk & Escalation Radar

> **Live Demo:** [https://risk-radar-app-three.vercel.app/](https://risk-radar-app-three.vercel.app/)

A real-time threat monitoring and **Human-in-the-Loop (HITL)** customer escalation dashboard powered by **Next.js**, **Tailwind CSS**, and **Google Gemini AI**.

---

## 🌟 Key Features

- **Real-Time AI Threat Analysis:** Analyzes incoming customer messages and scores risk urgency ($0-100\%$).
- **Structured Risk Classification:** Automatically categorizes posts into `SECURITY_BREACH`, `SERVICE_OUTAGE`, `PR_RISK`, or `GENERAL_FEEDBACK`.
- **Human-in-the-Loop Verification:** Agents can review AI suggestions, edit resolution plans, and approve or archive posts.
- **Executive Analytics Bar:** Quick metric cards tracking total posts, critical threats ($>80\%$), and top risk categories.
- **Audit Activity Log:** Live, timestamped event log tracking every action taken by system agents.
- **Status Filter Stream:** Sort posts seamlessly across `ALL`, `PENDING REVIEW`, `APPROVED`, and `ARCHIVED` tabs.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine:** [Google Gemini API (`@google/genai`)](https://ai.google.dev/)
- **Language:** TypeScript

---

## 🚀 How to Run Locally

Follow these steps to run the project on your machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/Tarshithreddy/risk-radar-app.git](https://github.com/Tarshithreddy/risk-radar-app.git)
cd risk-radar-app

### 2. Install Dependencies
```bash
npm install
### 3. Set Up Environment Variables
Create a .env.local file in the root directory and add your Google Gemini API key:

Code snippet
GEMINI_API_KEY=your_gemini_api_key_here
### 4. Run the Development Server
```Bash
npm run dev
Open http://localhost:3000 in your browser to see the dashboard running locally.