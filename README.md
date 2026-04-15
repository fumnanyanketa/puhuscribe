# PuhuScribe

**Finnish language learning SaaS app — AI tutor, structured curriculum, spaced repetition.**

by Fumnanya · [Live App](https://puhuscribe.vercel.app) · [GitHub](https://github.com/fumnanyanketa/puhuscribe)

---

## What It Does

PuhuScribe is a personal Finnish language learning app built for structured, self-paced study. It complements classroom learning with AI-powered sessions, vocabulary tracking, and grammar reference — all in one place.

Built for the SKK1 (Finnish A1–A2) curriculum, structured around 24 sessions that follow the CEFR A1→A2 progression as outlined by uusikielemme.fi and the University of Helsinki language framework.

### Core features

- **7-step session flow** — Theory → Drills → Speaking → Vocabulary → Conversation → Progression Check → Complete
- **AI tutor** — powered by Anthropic Claude (Sonnet), with a full student profile baked into the system prompt. Responds using the Origin → Logic → Rule → Exceptions → Examples teaching method
- **Session library** — 24 sessions with locked/active/complete status. Sessions 1–7 fully built with self-paced theory, conjugation tables, drills, vocabulary, and progression checks
- **Vocabulary bank** — words tagged by session, with Finnish TTS audio (Web Speech API, `lang='fi-FI'`)
- **Quick Reference** — offline grammar reference with tab-based navigation. Grows as the curriculum progresses
- **Error Tracker** — recurring mistake patterns tracked and fed into the drill queue
- **Professional Track** — industry-specific Finnish vocabulary (photography, AI, healthcare, hospitality, design)
- **Class Notes** — Google Docs sync (Phase 3)
- **Dark/light mode** — light default, dark sidebar always
- **Mobile responsive** — hamburger nav, stacked layouts, audio on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Plain CSS custom properties — no Tailwind, no component libraries |
| AI Tutor | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| State | React Context (AppContext) |
| Session storage | localStorage (Phase 3 → Supabase) |
| TTS Audio | Web Speech API (browser-native, no backend) |
| Hosting | Vercel |
| Fonts | Instrument Sans (headings) + DM Sans (body) via Google Fonts |

---

## Architecture

```
puhuscribe/
├── src/
│   ├── api/
│   │   └── claude.js          ← Anthropic API call + student system prompt
│   ├── components/
│   │   ├── Sidebar.jsx         ← Nav, logo, streak widget
│   │   ├── TopBar.jsx          ← Page title, theme toggle
│   │   ├── Dashboard.jsx       ← Home screen
│   │   ├── SessionLibrary.jsx  ← 24-session grid
│   │   ├── SessionFlow.jsx     ← Full 7-step session engine
│   │   ├── TutorChat.jsx       ← Standalone AI chat
│   │   └── Screens.jsx         ← QuickDrill, VocabBank, QuickReference,
│   │                              ErrorTracker, ProfessionalTrack, ClassNotes
│   ├── contexts/
│   │   └── AppContext.jsx      ← Theme, navigation, user state, session progress
│   ├── data/
│   │   └── sessions.js         ← All 24 sessions defined (1–7 fully built)
│   └── styles/
│       └── globals.css         ← Full design system — tokens, components, responsive
```

### Key design decisions

**No router.** Navigation is handled by a simple screen-switching pattern in AppContext. `navigate('screen_name')` swaps the active component. No URL changes, no React Router dependency.

**No backend.** The Claude API call is made directly from the browser using the `anthropic-dangerous-direct-browser-access` header. API key is stored as a Vercel environment variable (`VITE_ANTHROPIC_API_KEY`). This is intentional for Phase 1 — Phase 3 moves to a server proxy.

**CSS custom properties, not Tailwind.** All design tokens live in `globals.css` on `:root`. Light theme tokens are set on both `:root` AND `[data-theme="light"]` — this ensures the correct first paint before JavaScript runs, preventing the dark flash bug.

**Session content structure.** Each session in `sessions.js` has a theory object, drills array, vocab array, conversation object, and progression check object. The SessionFlow component reads this data and gracefully degrades to a "coming soon" state for sessions without full content.

**Curriculum sources.** Session grammar content is structured around the uusikielemme.fi A1 grammar reference (650+ free articles) and the University of Helsinki CEFR A1–A2 framework. All explanatory text is original.

---

## Roadmap

### Phase 2 — Supabase + Auth (Week 5–6)
- User authentication (email + Google login)
- Database schema: users, sessions, vocab_items, error_patterns, progression_checks
- Session progress moves from localStorage to Supabase
- Vocabulary bank grows per user, per session

### Phase 3 — Google Docs + AI Notes (Week 7–8)
- Google Docs API — sync teacher class notes automatically
- Claude reads notes → extracts vocabulary → populates vocab bank per session
- Claude reads notes → detects grammar rules → adds Quick Reference tabs
- Spaced repetition queue powered by Supabase timestamps

### Phase 4 — MCP Architecture (Week 9–10)
Six MCP (Model Context Protocol) servers replace the static system prompt:

| Server | Responsibility |
|---|---|
| `user-profile-server` | Learning profile, level, goals, industry track |
| `progress-server` | Session history, completed topics, progression check results |
| `error-tracker-server` | Recurring mistakes and patterns |
| `vocabulary-server` | Learned words, spaced repetition queue |
| `notes-server` | Class notes from Google Docs |
| `curriculum-server` | Session content, grammar rules, exceptions |

Claude self-directs context retrieval — it decides which servers to query based on what the student is doing. This replaces the current single static system prompt with dynamic, intelligent context management.

### Phase 5 — Multi-user + Professional Track (Week 11–12)
- Open access with personal journeys via user accounts
- Onboarding flow (name, level, course, industry tracks, Google Doc link)
- Sessions 8–24 built out with full content
- Professional Finnish track — industry-specific vocabulary per selection

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/fumnanyanketa/puhuscribe.git
cd puhuscribe

# Install dependencies
npm install

# Add your API key
cp .env.example .env
# Edit .env and add: VITE_ANTHROPIC_API_KEY=your-key-here

# Start dev server
npm run dev
# Opens at http://localhost:3000
```

### Environment variables

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Get your key from [console.anthropic.com](https://console.anthropic.com).

---

## Sprint Context

PuhuScribe is built as part of the **GodTier AI Architect Sprint** — a 16-week programme targeting the Claude Certified Architect (CCA-F) certification and Claude Partner Network membership.

This project demonstrates:
- Production React architecture with Claude API integration
- Context-aware AI system prompt design (Domain 2: Model Context Management)
- Progressive enhancement — Phase 1 works standalone, Phases 2–4 add database, auth, and MCP layers
- Service design thinking applied to AI systems — human-centred flows, not just working code

Content angle: **From Creative to AI Architect** · [Substack: Transcend](https://fumnanya.substack.com)

---

*Built by Fumnanya · Helsinki, Finland · 2026*
