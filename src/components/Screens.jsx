import { useState } from 'react'

export function QuickDrill() {
  return (
    <div className="page">
      <div className="page-header fade-up"><h2>Quick Drill</h2><p>Targeted practice built from your error patterns. Estimated 6 minutes.</p></div>
      <div className="card fade-up" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--blue-bg), var(--green-bg))', borderColor: 'var(--blue-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Today's drill queue is ready</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>3 error patterns · 18 vocabulary reviews due</div>
          </div>
          <button className="btn btn-primary">Start Now →</button>
        </div>
      </div>
      <div className="card fade-up-1">
        <div className="card-title">Today's Queue</div>
        {[
          { label: 'Partitive after negation', sub: 'Missed 6× · Minulla ei ole ____', status: 'due' },
          { label: 'käydä vs mennä', sub: 'Missed 4× · direction + frequency rule', status: 'due' },
          { label: 'PAIKALLISSIJAT — inessive vs adessive', sub: 'Flagged today in class', status: 'new' },
        ].map((item, i) => (
          <div className="list-row" key={i}>
            <div><div className="row-title">{item.label}</div><div className="row-sub">{item.sub}</div></div>
            <span className={`pill pill-${item.status}`}>{item.status === 'due' ? 'Priority' : 'New'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const VOCAB = [
  { fi: 'kauppakeskus', en: 'shopping centre', cat: 'Nouns', srs: 'ok' },
  { fi: 'kuunnella', en: 'to listen', cat: 'Type 3 Verb', srs: 'due' },
  { fi: 'käydä', en: 'to go (habitual)', cat: 'Type 2 Verb', srs: 'due' },
  { fi: 'kuntosali', en: 'gym / fitness centre', cat: 'Places', srs: 'ok' },
  { fi: 'joukkoliikenne', en: 'public transport', cat: 'Transport', srs: 'new' },
  { fi: 'herätä', en: 'to wake up', cat: 'Type 4 Verb', srs: 'due' },
  { fi: 'arkisin', en: 'on weekdays', cat: 'Time', srs: 'new' },
  { fi: 'töissä', en: 'at work', cat: 'Places', srs: 'due' },
  { fi: 'paikallissijat', en: 'local cases (-ssa, -lla)', cat: 'Grammar', srs: 'new' },
  { fi: 'inesiivi', en: 'inessive case (-ssa/-ssä)', cat: 'Grammar', srs: 'new' },
  { fi: 'adessiivi', en: 'adessive case (-lla/-llä)', cat: 'Grammar', srs: 'new' },
]
const SRS = { ok: '✓ Learned', due: 'Due', new: 'New' }

export function VocabBank() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const filters = ['All', 'Due Today', 'Verbs', 'Nouns', 'Places', 'Grammar', 'Transport', 'Time']
  const filtered = VOCAB.filter(v => {
    const q = search.toLowerCase()
    if (search) return v.fi.toLowerCase().includes(q) || v.en.toLowerCase().includes(q)
    if (filter === 'Due Today') return v.srs === 'due'
    if (filter !== 'All') return v.cat === filter
    return true
  })
  const speak = (w) => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(w); u.lang = 'fi-FI'; speechSynthesis.speak(u) } }
  return (
    <div className="page">
      <div className="page-header fade-up"><h2>Vocabulary Bank</h2><p>{VOCAB.length} words learned · {VOCAB.filter(v=>v.srs==='due').length} due for review today</p></div>
      <div className="search-bar fade-up">
        <span style={{ color: 'var(--text-4)', fontSize: 15 }}>🔍</span>
        <input type="text" placeholder="Search Finnish or English…" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: 14 }}>✕</button>}
      </div>
      <div className="filter-chips fade-up-1">
        {filters.map(f => <div key={f} className={`chip ${filter===f?'active':''}`} onClick={() => setFilter(f)}>{f}</div>)}
      </div>
      <div className="vocab-table fade-up-2">
        <div className="vocab-row header"><div>Finnish</div><div>English</div><div className="col-cat">Category</div><div className="col-srs">Review</div><div/></div>
        {filtered.length > 0 ? filtered.map((v, i) => (
          <div className="vocab-row" key={i}>
            <div className="vocab-fi">{v.fi}</div>
            <div className="vocab-en">{v.en}</div>
            <div className="col-cat"><span className="tag">{v.cat}</span></div>
            <div className="col-srs"><span className={`pill pill-${v.srs}`}>{SRS[v.srs]}</span></div>
            <div><button className="audio-btn" onClick={() => speak(v.fi)}>🔊</button></div>
          </div>
        )) : <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-4)', fontSize: 13 }}>No words match.</div>}
      </div>
    </div>
  )
}

/* ── QUICK REFERENCE — HIGH LEVEL CONCEPTS ONLY ── */
const CASES = [
  { name: 'Nominative', suffix: '–', use: 'Subject · talo' },
  { name: 'Partitive', suffix: '-a/-ä', use: 'Partial / negation · taloa' },
  { name: 'Inessive', suffix: '-ssa/-ssä', use: 'Inside · talossa' },
  { name: 'Elative', suffix: '-sta/-stä', use: 'Out of · talosta' },
  { name: 'Illative', suffix: '-Vn/-hVn', use: 'Into · taloon' },
  { name: 'Adessive', suffix: '-lla/-llä', use: 'On / at · talolla' },
  { name: 'Allative', suffix: '-lle', use: 'Onto / to · talolle' },
  { name: 'Genitive', suffix: '-n', use: 'Possession · talon' },
]

const KPT = [
  { from: 'KK', to: 'K', ex: 'kukka → kukassa' },
  { from: 'PP', to: 'P', ex: 'Eurooppa → Euroopassa' },
  { from: 'TT', to: 'T', ex: 'konsertti → konsertissa' },
  { from: 'K', to: '–', ex: 'Turku → Turussa' },
  { from: 'P', to: 'V', ex: 'papu → pavut' },
  { from: 'T', to: 'D', ex: 'pöytä → pöydällä' },
  { from: 'NT', to: 'NN', ex: 'kuunnella stem' },
  { from: 'LT', to: 'LL', ex: 'sukeltaa stem' },
  { from: 'NK', to: 'NG', ex: 'Hanko → Hangossa' },
]

export function QuickReference() {
  const [tab, setTab] = useState('location')
  return (
    <div className="page">
      <div className="page-header fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2>Quick Reference</h2>
          <span className="offline-badge"><span className="offline-dot"/>Works Offline</span>
        </div>
        <p>High-level grammar concepts. For deeper explanations, ask the AI tutor.</p>
      </div>
      <div className="filter-chips fade-up">
        {[{id:'location',label:'📍 Location Cases'},{id:'cases',label:'📐 All Cases'},{id:'kpt',label:'🔀 KPT'}].map(t => (
          <div key={t.id} className={`chip ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {tab === 'location' && (
        <div className="fade-up-1">
          <div className="ref-grid" style={{ marginBottom: 16 }}>
            {/* Inessive */}
            <div className="ref-card">
              <div className="ref-card-title">Inessive · -SSA / -SSÄ</div>
              <div className="ref-concept">
                <div className="ref-concept-title">The idea: inside something</div>
                <div className="ref-concept-sub">Use when you are enclosed within a space — a room, a building, a container. Answers <strong>MISSÄ?</strong> for interior locations.</div>
                <div className="ref-concept-example">talossa · koulussa · laukussa</div>
              </div>
              <div className="exception-box" style={{ marginBottom: 0 }}>
                <div className="exc-label">⚠ Watch out</div>
                <p>Some words that feel "inside" use -lla instead — <strong>kurssilla, matkalla, lomalla, kuntosalilla</strong>. Ask the tutor to drill these.</p>
              </div>
            </div>
            {/* Adessive */}
            <div className="ref-card">
              <div className="ref-card-title">Adessive · -LLA / -LLÄ</div>
              <div className="ref-concept">
                <div className="ref-concept-title">The idea: on a surface or at a place</div>
                <div className="ref-concept-sub">Use for open surfaces, outdoor locations, or places you attend. Answers <strong>MISSÄ?</strong> for exterior or attendance locations.</div>
                <div className="ref-concept-example">kadulla · pöydällä · torilla</div>
              </div>
              <div className="exception-box" style={{ marginBottom: 0 }}>
                <div className="exc-label">⚠ Countries & islands</div>
                <p>Most countries → <strong>-ssa</strong> (Ruotsissa). Island countries → <strong>-lla</strong> (Maltalla). Only exception: <strong>Venäjällä</strong>.</p>
              </div>
            </div>
          </div>
          <div className="card fade-up-2">
            <div className="card-title">The three location question pairs</div>
            {[
              { q: 'MISSÄ?', a: '-ssa / -lla', note: 'Where are you? Static location.' },
              { q: 'MISTÄ?', a: '-sta / -lta', note: 'Where from? Moving away from.' },
              { q: 'MIHIN?', a: '-Vn / -lle', note: 'Where to? Moving toward.' },
            ].map((r, i) => (
              <div key={i} className="list-row">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 800, fontSize: 14, fontFamily: 'monospace', minWidth: 72 }}>{r.q}</span>
                  <span style={{ color: 'var(--amber)', fontWeight: 700, fontFamily: 'monospace', minWidth: 90 }}>{r.a}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{r.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'cases' && (
        <div className="ref-grid fade-up-1">
          <div className="ref-card">
            <div className="ref-card-title">📐 Finnish Cases — Key 8</div>
            {CASES.map((c, i) => (
              <div className="case-row" key={i}>
                <span className="case-name">{c.name}</span>
                <span className="case-suffix">{c.suffix}</span>
                <span className="case-use">{c.use}</span>
              </div>
            ))}
          </div>
          <div className="ref-card">
            <div className="ref-card-title">The core logic</div>
            <div className="ref-concept">
              <div className="ref-concept-title">Finnish has 15 cases in total</div>
              <div className="ref-concept-sub">These 8 are the most common. Each case replaces what other languages express with prepositions ("in", "from", "to"). The ending changes based on vowel harmony (a/o/u words vs ä/ö/y words).</div>
            </div>
            <div className="rule-box" style={{ marginBottom: 0 }}>
              <div className="rule-label">Vowel harmony reminder</div>
              <p>Words with a, o, u → use <strong>-ssa, -sta, -lla</strong><br/>Words with ä, ö, y → use <strong>-ssä, -stä, -llä</strong><br/>Words with only i, e → use the front vowel forms</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'kpt' && (
        <div className="ref-grid fade-up-1">
          <div className="ref-card">
            <div className="ref-card-title">🔀 KPT Consonant Gradation</div>
            <table className="kpt-table">
              <thead><tr><th>Strong</th><th>Weak</th><th>Example</th></tr></thead>
              <tbody>{KPT.map((k,i) => <tr key={i}><td className="kpt-from">{k.from}</td><td className="kpt-to">{k.to}</td><td className="kpt-ex">{k.ex}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="ref-card">
            <div className="ref-card-title">The concept</div>
            <div className="ref-concept">
              <div className="ref-concept-title">Stop consonants soften in weak grade</div>
              <div className="ref-concept-sub">When you add a case ending that starts with a consonant, the final stop consonant in the stem softens or disappears. This happens only in the last syllable.</div>
            </div>
            <div className="exception-box">
              <div className="exc-label">⚠ No KPT for these</div>
              <p><strong>ST, SK, TK, HK</strong> clusters never grade.<br/>Example: posti → postissa (no change)</p>
            </div>
            <div className="rule-box" style={{ marginBottom: 0 }}>
              <div className="rule-label">Quick rule</div>
              <p>Consonant suffix → weak grade. Vowel suffix → strong grade stays.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ERRORS = [
  { title: 'Partitive after negation', count: '× 6', desc: 'Consistently using nominative instead of partitive after "ei ole". Rule: any negated "minulla ei ole" requires partitive.', example: 'You wrote: "Minulla ei ole kissa" → Correct: "Minulla ei ole kissaa"' },
  { title: 'käydä vs mennä confusion', count: '× 4', desc: 'Using mennä for habitual/repeated actions. käydä = habitual or back-and-forth. mennä = one direction, one time.', example: 'You wrote: "Menen kaupassa joka viikko" → Correct: "Käyn kaupassa joka viikko"' },
  { title: 'Verb Type 1 — double vowel for hän', count: '× 3', desc: 'Missing the double vowel ending for 3rd person singular in Type 1 verbs.', example: 'You wrote: "Hän asua Helsingissä" → Correct: "Hän asuu"' },
]

export function ErrorTracker() {
  return (
    <div className="page">
      <div className="page-header fade-up"><h2>Error Tracker</h2><p>8 recurring patterns identified. These feed directly into your Quick Drill queue.</p></div>
      <div className="fade-up-1">
        {ERRORS.map((e, i) => (
          <div className="error-item" key={i}>
            <div className="error-header"><div className="error-title">{e.title}</div><span className="error-count">{e.count}</span></div>
            <div className="error-desc">{e.desc}</div>
            <div className="error-example">{e.example}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const INDUSTRIES = [
  { icon: '📷', name: 'Photography & Creative', sub: 'Client sessions, bookings', id: 'photo' },
  { icon: '🤖', name: 'AI & Technology', sub: 'Architecture, tools, process', id: 'ai' },
  { icon: '🏥', name: 'Healthcare', sub: 'Clinical, patient, admin', id: 'health' },
  { icon: '🍽', name: 'Hospitality & Service', sub: 'Restaurants, hotels', id: 'hospitality' },
  { icon: '📐', name: 'Design & Architecture', sub: 'Briefs, clients, studios', id: 'design' },
  { icon: '+', name: 'Add Custom', sub: 'Type your own industry', id: 'custom' },
]

export function ProfessionalTrack() {
  const [selected, setSelected] = useState(['photo', 'ai'])
  const toggle = (id) => { if (id === 'custom') return; setSelected(p => p.includes(id) ? p.filter(x => x!==id) : [...p,id]) }
  return (
    <div className="page">
      <div className="page-header fade-up"><h2>Professional Track</h2><p>Select your industries. The AI generates Finnish vocabulary and client conversations for your work context.</p></div>
      <div className="industry-grid fade-up-1">
        {INDUSTRIES.map(ind => (
          <div key={ind.id} className={`industry-card ${selected.includes(ind.id)?'selected':''}`} onClick={() => toggle(ind.id)}>
            <div className="industry-icon">{ind.icon}</div>
            <div className="industry-name">{ind.name}</div>
            <div className="industry-sub">{ind.sub}</div>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="card fade-up-2">
          <div className="card-title">✓ {selected.length} active — {selected.map(id=>INDUSTRIES.find(i=>i.id===id)?.name).filter(Boolean).join(' · ')}</div>
          <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 16 }}>Your tutor will incorporate vocabulary and client scenarios from your selected industries. Ask for industry-specific drills in the Session Room at any time.</p>
          <button className="btn btn-primary">Start Industry Session →</button>
        </div>
      )}
    </div>
  )
}

const NOTES = [
  { date: '15 April 2026 — Today', items: ['PAIKALLISSIJAT — inessive (-ssa/-ssä) vs adessive (-lla/-llä), concept and examples', 'City endings origin logic: water body names → -ssa / city as place → -lla', 'Exceptions list: kurssi, matka, loma, kuntosali → all use -lla', 'Countries: most → -ssa / island nations → -lla / Venäjä → -lla exception', 'päästäkseen construction — Opiskelen suomea päästäkseni yliopistoon'] },
  { date: '11 April 2026', items: ['Verb types 1–4 review with KPT table', 'KÄYDÄ + SSA vs MENNÄ + MIHIN — habitual vs directional', 'Time expressions: monelta / mihin aikaan / puoli / vartti / vaille'] },
]

export function ClassNotes() {
  return (
    <div className="page">
      <div className="page-header fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div><h2>Class Notes</h2><p>Synced from Google Docs · Last updated today, 12:47</p></div>
        <button className="btn btn-ghost">⟳ Sync Now</button>
      </div>
      <div className="fade-up-1">
        {NOTES.map((note, i) => (
          <div className="card" style={{ marginBottom: 14 }} key={i}>
            <div className="card-title">📅 {note.date}</div>
            {note.items.map((item, j) => (
              <div key={j} style={{ padding: '9px 0', borderBottom: j < note.items.length-1 ? '1px solid var(--border)' : 'none', fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.65 }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="card fade-up-2" style={{ background: 'var(--surface2)' }}>
        <div className="card-title">📎 Connect Your Google Doc</div>
        <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 16 }}>Paste your Google Docs link. Notes sync automatically when your teacher adds content.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" className="drill-input" placeholder="https://docs.google.com/document/d/…" style={{ flex: 1 }} />
          <button className="btn btn-primary">Connect</button>
        </div>
      </div>
    </div>
  )
}
