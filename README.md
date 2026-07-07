# BharatSathi AI – Intelligent Civic Companion

> AI-powered platform empowering every Indian citizen to access government services, report public issues, and receive personalized assistance.

---

## Features

- **AI Civic Assistant** — Gemini-powered conversational AI for all government queries
- **Government Scheme Finder** — Personalized scheme recommendations based on age, state, income, occupation
- **Complaint Tracker** — Register, track, and visualize civic complaint status
- **Document Assistant** — Step-by-step guides for Passport, PAN, Aadhaar, Voter ID, and more
- **Multilingual Support** — English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada
- **Voice Assistant** — Speech-to-text in any Indian language
- **Citizen Dashboard** — Profile, saved schemes, complaint history, notifications
- **Analytics Dashboard** — Personal and platform-wide civic insights

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (dark theme, glassmorphism)
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **AI**: Gemini 1.5 Flash via Supabase Edge Functions
- **Routing**: React Router v6

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project (already provisioned)

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
Already configured in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Gemini AI (Optional)
To enable the Gemini-powered AI Assistant, add your `GEMINI_API_KEY` to Supabase Edge Function secrets. Without it, the app uses intelligent fallback responses.

## Pages

| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/auth` | Sign In / Sign Up |
| `/dashboard` | Citizen Dashboard |
| `/assistant` | AI Chat Assistant |
| `/schemes` | Government Scheme Finder |
| `/complaints` | Complaint Tracker |
| `/documents` | Document Assistant |
| `/voice` | Voice Assistant |
| `/analytics` | Analytics Dashboard |
| `/profile` | Citizen Profile |
| `/settings` | App Settings |

## Database Schema

- `profiles` — Citizen profiles (state, occupation, income, language preferences)
- `complaints` — Civic complaints with status tracking
- `complaint_updates` — Timeline entries for each complaint
- `saved_schemes` — User-bookmarked government schemes
- `chat_history` — AI conversation history
- `notifications` — System and AI notifications

All tables use Row Level Security (RLS) — users only see their own data.

## Deployment

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or any static host
```

---

*Ek Bharat, Shreshtha Bharat — Empowering Every Citizen with AI*
