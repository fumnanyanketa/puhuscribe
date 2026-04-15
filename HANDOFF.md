# PuhuScribe — Complete Project Handoff

## READ THIS FIRST

This is a full project transfer. You are picking up a Finnish language learning app called **PuhuScribe** that has been built across many sessions in another chat. Everything you need to continue is in this zip file. This document tells you exactly what has been built, every decision that was made, what the current problems are, and what needs to happen next. Read the entire document before touching any code.

---

## 1. What PuhuScribe Is

PuhuScribe is a personal Finnish language learning web app for a user named **Fumnanya** — a Nigerian-born creative professional based in Helsinki, Finland since September 2023. She attends a Finnish A1–A2 classroom course (SKK1) Monday–Thursday 09:00–12:30. Her target is B2 Finnish fluency.

The app is designed to:
- Complement her classroom learning with structured AI-powered sessions
- Track her progress through 24 sessions of the SKK1 curriculum
- Build vocabulary with spaced repetition
- Provide a quick reference panel for grammar rules
- Track recurring errors and feed them into targeted drills
- Support multiple users, each with their own personal learning journey

The app is part of a **brand family** Fumnanya has built, all with the `-scribe` suffix:
- **EchoScribe** — speech-to-text tool
- **VerdictScribe** — religious forensic tool
- **MultiScribe** — content multiplier tool
- **PuhuScribe** — Finnish language learning (*puhua* means "to speak" in Finnish)

All apps share the tagline **"by Fumnanya"**.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + Vite | SPA, no Next.js |
| Styling | Plain CSS custom properties | One globals.css file. No Tailwind. No CSS-in-JS. No component libraries. |
| AI Tutor | Anthropic Claude API (Sonnet) | claude-sonnet-4-20250514 |
| State | React Context (AppContext) | Phase 3 will add Supabase |
| Database | Not yet connected | Phase 3 |
| Auth | Not yet connected | Phase 3 — when connected, each user gets their own journey |
| Notes sync | Not yet connected | Phase 3 — Google Docs API |
| Hosting | Vercel (planned) | Not yet deployed |
| Fonts | Google Fonts via link tag | Currently Plus Jakarta Sans — user wants this changed |

---

## 3. Brand Identity

### Logo
"PuhuScribe" rendered as **gradient text**: `linear-gradient(135deg, #4f7eff 0%, #9b6dff 100%)` applied using `-webkit-background-clip: text`. This is non-negotiable — it was confirmed by the user with a reference screenshot of the EchoScribe logo.

### Tagline
"BY FUMNANYA" — spaced small caps (letter-spacing ~2.5px, text-transform uppercase), muted colour, sits directly beneath the logo text.

### Primary brand colours
- Blue: `#4f7eff`
- Purple: `#9b6dff`
- Gradient: `linear-gradient(135deg, #4f7eff 0%, #9b6dff 100%)`

### Primary buttons
Use the brand gradient as background. White text. Subtle box shadow in brand colour.

---

## 4. Design Direction — THIS IS THE MAIN TASK

**The current design is not working.** The user has explicitly rejected the existing UI multiple times. She wants a completely new design. This is the primary reason for the handoff.

### What she wants
- **Clean, minimal, professional SaaS dashboard aesthetic**
- Inspired by two references she shared (described below)
- Feels like a serious, well-crafted tool — not a student project
- **Light mode is the default** — the app opens in light
- Dark mode available via toggle
- **The sidebar is always dark navy regardless of theme** — this does not change with the toggle
- Premium typography — serious heading font, not playful

### Design reference 1 (project management dashboard)
Clean white content area. Dark navy sidebar with icon-only navigation. Calendar widget, urgent tasks list, project directory, team directory cards. Very structured, generous whitespace, clear card hierarchy.

### Design reference 2 (language learning platform)
Pink/magenta top navigation bar. White content area. User profile sidebar on the left. Lesson activity feed on the right. Friendly but professional. Shows both desktop and mobile views side by side.

### Typography — USER EXPLICITLY REJECTED current font
The current heading font (Plus Jakarta Sans / Fraunces) has been rejected. User wants something that feels **serious, professional, and used in important documents or high-quality SaaS products**. Her words: "a font that will be used in a very serious document or a serious app." Not playful. Not quirky.

Suggested options: **Instrument Serif**, **Libre Baskerville**, **Playfair Display**, **Cormorant Garamond**, or similar premium serif for headings. Pair with a clean modern sans-serif for body (DM Sans, Outfit, etc.). Make a considered choice and commit to it.

### Critical bug to fix immediately
The app currently opens in dark mode despite the toggle being set to light. This happens because the CSS defines `[data-theme="light"]` and `[data-theme="dark"]` as separate blocks, but does not set light values as the `:root` default. **Fix: set all light theme token values directly on `:root` AND on `[data-theme="light"]`. Set dark values only on `[data-theme="dark"]`.** This ensures the app renders in light mode on first load before JavaScript runs.

---

## 5. Complete Feature Map — What Is Built

### Phase 1 (complete)
- Full app shell with sidebar + topbar + 8 screens
- Mobile responsive — sidebar collapses to hamburger at ≤768px
- Dark/light mode toggle (broken default, needs fix)
- Claude API wired in with full learning profile baked into system prompt
- All 8 screens exist with real content

### Phase 2 (complete)
- Session Library — all 24 SKK1 sessions visible in a grid, with locked/active/complete status
- Full 7-step session flow for Session 7 (the active session):
  1. Theory — logic chain, rule box, exception box, examples, puhekieli variants, inline ask-tutor
  2. Drills — 4 drills, checked individually, score shown
  3. Speaking — Finnish TTS via Web Speech API, play buttons
  4. Vocabulary — 13 flip cards, tap to reveal, audio plays on reveal
  5. Conversation — live AI dialogue in Finnish, 2+ turns required
  6. Progression Check — 5 questions, AI-evaluated by Claude, 4/5 to pass
  7. Complete — celebration, stats, next session preview
- Session gating — progression check pass/fail is real. Fail → retry or review weak points
- Session progress persisted to localStorage (Phase 3 will move to Supabase)

### Phase 3 (NOT YET BUILT — next major phase)
- Supabase database integration
- User authentication — each user gets their own journey
- Google Docs API — sync teacher's class notes automatically
- Vocabulary bank auto-populated from notes (AI extracts words per session)
- Quick Reference tabs auto-populated from notes (AI detects new grammar rules)
- Sanatyyppi (word types) tab in Quick Reference, also auto-populated from notes
- Spaced repetition queue powered by database (currently only mocked in UI)

---

## 6. All Design Decisions Made — Do Not Reverse These

These were explicitly confirmed by the user. Do not change them.

| Decision | Detail |
|---|---|
| Brand name | PuhuScribe |
| Tagline | by Fumnanya |
| Logo treatment | Gradient text, blue → purple |
| Sidebar colour | Always dark navy, both themes |
| Default theme | Light |
| Session gating | Progression check must be passed to unlock next session |
| Quick Reference style | High-level concepts only. Not granular. Granular detail belongs in AI tutor chat. |
| Quick Reference structure | Tab-based. New grammar tabs added as class covers them. Never all at once. |
| Sanatyyppi | Gets its own tab in Quick Reference. Auto-populated from notes in Phase 3. |
| Vocabulary bank | Tagged by session. Grows session by session. Powered by Supabase in Phase 3. |
| Professional track | User selects industry. Multi-select. AI generates content for chosen industries. |
| User auth model | Open access app. Each user creates an account and has their own journey. |
| Class notes | Each user connects their own Google Doc. Not shared. |
| Textbooks | No textbook content in the app — copyrighted. Use free curriculum references instead. |
| Free curriculum reference | uusikielemme.fi (650+ grammar articles, fully free) + University of Helsinki CEFR structure |
| MCP architecture | Phase 3 will use MCP servers for Claude to self-direct context retrieval from Supabase |
| Streak widget | Lives in sidebar. User confirmed they like it. Keep it. |

---

## 7. User Profile — Fumnanya

This is baked into the Claude system prompt in `src/api/claude.js`. Do not change it.

- Nigerian-born, based in Helsinki since September 2023
- Freelance portrait photographer, graphic designer, AI architect in training
- MBA in Service Design (Novia UAS, 2024)
- Finnish class: Monday–Thursday 09:00–12:30 (SKK1, A1–A2)
- Textbooks: No niin 1, Suomen Mestari 1
- Weak areas: verb conjugation, grammatical cases, partitive vs nominative, time expressions, spontaneous sentence forming, speaking confidence
- Daily contexts for examples: Finnish class, gym (kuntosali), public transport, grocery shopping, photography clients, evening cleaning job

---

## 8. Teaching Method — Non-Negotiable in All AI Responses

Every grammar explanation the AI tutor gives must follow this exact structure:

**Origin → Logic → Rule → Exceptions → Examples**

Never state a rule without explaining why it exists. Always show the exception immediately after the rule. Ground examples in Fumnanya's real daily life. Show puhekieli (spoken Finnish) alongside standard Finnish. Give direct, honest feedback — no excessive praise.

---

## 9. Current File Structure

```
puhuscribe/
├── index.html                          ← Google Fonts link here
├── package.json
├── vite.config.js
├── .env.example                        ← VITE_ANTHROPIC_API_KEY goes here
├── .gitignore
└── src/
    ├── main.jsx                        ← Entry point, wraps app in AppProvider
    ├── App.jsx                         ← Screen router
    ├── api/
    │   └── claude.js                   ← API call + system prompt (DO NOT CHANGE LOGIC)
    ├── contexts/
    │   └── AppContext.jsx              ← Theme, nav, user, session progress (DO NOT CHANGE LOGIC)
    ├── data/
    │   └── sessions.js                 ← All 24 sessions defined (DO NOT CHANGE)
    ├── components/
    │   ├── Sidebar.jsx                 ← Nav, logo, streak
    │   ├── TopBar.jsx                  ← Page title, theme toggle
    │   ├── Dashboard.jsx               ← Home screen
    │   ├── SessionLibrary.jsx          ← 24-session grid
    │   ├── SessionFlow.jsx             ← Full 7-step session engine
    │   ├── TutorChat.jsx               ← Standalone AI chat component
    │   ├── SessionRoom.jsx             ← Legacy session view (can be removed)
    │   └── Screens.jsx                 ← QuickDrill, VocabBank, QuickReference,
    │                                      ErrorTracker, ProfessionalTrack, ClassNotes
    └── styles/
        └── globals.css                 ← ALL styles. Replace entirely.
```

---

## 10. Screen Routing

The app uses a simple screen-switching pattern via `useApp()`. No React Router.

```jsx
// In AppContext.jsx
navigate('screen_name')             // switches screen
navigate('session_flow', { sessionId: 7 })   // with params

// Available screen names:
// dashboard, sessions, session_flow, session,
// quickdrill, vocab, reference, errors,
// professional, notes, tutor
```

---

## 11. Sidebar Navigation Structure

```
LEARN
  ⌂  Dashboard
  ◫  All Sessions
  ⚡ Quick Drill          [badge: 5, amber]

REFERENCE
  ◈  Vocabulary Bank
  ◉  Quick Reference      [badge: ✓, green]
  △  Error Tracker        [badge: 8, amber]

MY TRACKS
  ◆  Professional Track
  ≡  Class Notes
```

---

## 12. Quick Reference — How It Works

Three tabs currently. More will be added over time as class covers new topics.

**Tab 1 — Location Cases**
Two concept cards: Inessive (-SSA/-SSÄ) and Adessive (-LLA/-LLÄ). Each card shows the concept title, one-sentence idea, one example line, and an exception callout. Below the cards: a 3-row table showing MISSÄ/MISTÄ/MIHIN with their endings and what they mean.

**Tab 2 — All Cases**
Case table (8 cases: name, suffix, example) + vowel harmony explanation card.

**Tab 3 — KPT**
9-row gradation table + "no KPT for these clusters" card + concept explanation.

**Important:** This panel is intentionally high-level. Users get granular detail by asking the AI tutor. The Quick Reference is a 10-second reminder, not a lesson. Do not make it more detailed.

**Future tabs** (to be added in Phase 3 as class progresses):
- Sanatyyppi (word types) — auto-populated from Google Docs notes
- Partitive vs Nominative
- Verb Types overview
- Possessive suffixes
- Full 15 cases

---

## 13. Vocabulary Bank — Current State

The vocabulary table shows a sample set of words from sessions already completed. The filter chips (All, Due Today, Verbs, Nouns, etc.) work by filtering the hardcoded sample data. In Phase 3, this will be replaced by Supabase data that grows session by session. The audio button uses `speechSynthesis` with `lang = 'fi-FI'`.

---

## 14. Session 7 — The Active Session

Session 7 is the only session with full content defined. Topic: **Verb Type 3 + KPT NT→NN**. All 5 other phases have only metadata.

The full content lives in `src/data/sessions.js` inside the session object with id 7. It includes:
- theory object (origin, logic, rule, exceptions array, examples array, puhekieli array)
- drills array (4 drills with type, prompt, sentence, answer, hint)
- vocab array (13 words with fi, en, type, memory anchor)
- conversation object (setup, starter, example_response)
- progression_check object (instructions, questions array)

The `SessionFlow.jsx` component reads this data. It will gracefully display a "coming soon" message for any session that doesn't have full content yet.

---

## 15. What Needs to Happen Next — In Order

### IMMEDIATE (this handoff) — UI Rebuild
Replace the visual design entirely. Keep all logic. Fix the dark mode default bug. The goal: a clean, professional, light-first SaaS interface that looks like it belongs in the same family as EchoScribe.

### After UI is approved — Phase 3
1. Set up Supabase project
2. User authentication (email + Google login)
3. Database schema: users, sessions, vocab_items, error_patterns, progression_checks
4. Session progress moves from localStorage to Supabase
5. Vocabulary bank populated from session data + stored per user
6. Google Docs API integration — teacher notes sync
7. AI reads notes → extracts grammar rules → populates Quick Reference
8. AI reads notes → extracts vocabulary → populates vocab bank per session
9. Spaced repetition queue powered by database timestamps
10. MCP server architecture for Claude context retrieval

### After Phase 3 — Phase 4
- Open the app to other users (currently Fumnanya-specific)
- Each user goes through onboarding: name, level, course name, industry tracks, Google Doc link
- Professional track with multi-industry selection
- More sessions built out for SKK1 (Sessions 8–24 need full content)

---

## 16. Environment Setup

The new model/developer receiving this handoff needs:

1. **Node.js** installed (LTS version)
2. **Anthropic API key** — get from console.anthropic.com. Add to `.env` as `VITE_ANTHROPIC_API_KEY=sk-ant-...`
3. Run `npm install` in the project root
4. Run `npm run dev` — opens at http://localhost:3000

To deploy:
1. Push to GitHub
2. Connect to Vercel
3. Add `VITE_ANTHROPIC_API_KEY` as environment variable in Vercel dashboard
4. Deploy — gets a public URL

---

## 17. Important Notes for the New Model

1. **The user communicates by voice dictation.** Messages may be transcribed speech — casual, run-on, imprecise. Interpret charitably and play back your understanding before building.

2. **Do not move forward without confirmation.** This user likes to see the plan before execution. Always summarise what you are about to do and wait for a "go ahead" before writing code.

3. **The app must build cleanly.** Always run `npm run build` before packaging any zip file. Never deliver code that fails to compile.

4. **One zip at a time.** Deliver one zip file per phase or per significant change. The user downloads and replaces files locally.

5. **When delivering a zip**, always tell the user: extract the zip, copy the contents into their existing project folder (replacing files), run `npm install` (only needed if package.json changed), then `npm run dev`.

6. **The design is the current blocker.** Until the user approves the design, do not build new features. The design must be resolved first.

7. **Session content.** Only Session 7 has full content. Sessions 1–6 are marked complete (mock data). Sessions 8–24 are locked. The 7-step flow gracefully degrades for sessions without full content — it shows a "coming soon" message and a back button.

8. **Fumnanya's class notes** are on a continuous Google Doc shared by her teacher. The notes in `Screens.jsx` (ClassNotes component) are hardcoded sample data. The Google Docs sync is a Phase 3 feature.

9. **The curriculum reference** is uusikielemme.fi — over 650 free Finnish grammar articles. This is the reference backbone used instead of copyrighted textbooks. The AI references this conceptually but does not scrape or reproduce content from it.

10. **MCP (Model Context Protocol)** — Fumnanya is learning about MCP as part of an AI architect sprint. The Phase 3 architecture will use MCP servers so Claude can self-direct what context it fetches (user profile, errors, vocab, notes). This is intentional and was confirmed as a learning opportunity for her.

---

## 18. Confirmation of What Was Agreed

Before ending the previous session, Fumnanya confirmed all of the following:

- Spaced repetition for vocabulary ✓
- Error memory and targeted re-drilling ✓
- Text-to-speech for Finnish sentences ✓
- Quick Reference panel (works offline) ✓
- Flag for review button ✓
- Class alignment / covered today marker ✓
- Modular session length + quick drill mode ✓
- Professional track with industry choice ✓
- Offline mode for reference and saved content ✓
- Open access app with personal journeys via user accounts ✓
- MCP architecture for Phase 3 ✓
- Google Docs notes sync ✓
- Sanatyyppi in Quick Reference ✓
- Vocabulary bank per session ✓
- Option B for curriculum evolution (wait for Phase 3 Supabase before auto-populating QR) ✓

---

## 19. Handoff Checklist for New Model

When you receive this handoff, do the following in order:

- [ ] Read this entire document
- [ ] Open and read `src/api/claude.js` — understand the system prompt
- [ ] Open and read `src/contexts/AppContext.jsx` — understand the navigation and state model
- [ ] Open and read `src/data/sessions.js` — understand the session structure
- [ ] Open and read `src/App.jsx` — understand the routing
- [ ] Open `src/styles/globals.css` — this is what you are replacing
- [ ] Open each component file — understand what each screen renders
- [ ] Confirm your understanding of the full design brief with Fumnanya before building
- [ ] Build the new UI
- [ ] Run `npm run build` — confirm zero errors
- [ ] Package and deliver

---

*End of handoff document. Good luck.*
