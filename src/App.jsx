import React, { useEffect, useState } from "react";
import "./App.css";

/*
  AI Judicial Suite - App.jsx
  - Responsive layout with hamburger drawer for mobile (Option A)
  - Dark / Light theme
  - Mock auth (signup/login) and simple Assistant / Lawyer / Judge pages
  - Avoids horizontal overflow by placing login controls under nav on small screens
*/

function sampleCases() {
  return [
    {
      id: "CASE-001",
      title: "Breach of Contract — Service Agreement",
      description:
        "Plaintiff claims Defendant failed to deliver contracted services within the agreed timeline. Key witnesses: A, B. Exhibit A: signed contract. Exhibit B: emails showing missed deadlines.",
      tags: ["contract", "civil"],
      evidence: [{ id: "ev1", name: "Exhibit A - Contract" }],
      status: "Under Review",
      timeline: [{ ts: Date.now() - 1000 * 60 * 60 * 24, actor: "System", action: "Imported" }],
      messages: [],
      ruling: null,
    },
    {
      id: "CASE-002",
      title: "Neighbor Dispute — Noise Complaint",
      description: "Defendant alleges plaintiff created excessive noise after 10 PM. Seeking injunction and damages.",
      tags: ["tort"],
      evidence: [],
      status: "Submitted",
      timeline: [{ ts: Date.now() - 1000 * 60 * 60 * 12, actor: "User:Anon", action: "Submitted" }],
      messages: [],
      ruling: null,
    },
  ];
}

export default function App() {
  // routing
  const [route, setRoute] = useState("assistant"); // assistant | lawyer | judge

  // theme
  const [theme, setTheme] = useState("dark"); // dark | light

  // auth (mock)
  const [users, setUsers] = useState(() => [{ name: "Judge Judy", role: "Judge", password: "judgepass" }]);
  const [user, setUser] = useState(null);
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("Lawyer");
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: "", role: "Lawyer", password: "" });

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // app data
  const [cases, setCases] = useState(sampleCases());
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || null);
  const [assistantHistory, setAssistantHistory] = useState({});

  // debug: prevent overflow on mount (defensive)
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
  }, []);

  // theme side-effect: add class to body for CSS scoping
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // auth handlers (mock)
  const signup = () => {
    const { name, role, password } = signupForm;
    if (!name.trim() || !password.trim()) return alert("Please provide name and password");
    if (users.find((u) => u.name.toLowerCase() === name.trim().toLowerCase())) return alert("User already exists (prototype)");
    const u = { name: name.trim(), role, password };
    setUsers((prev) => [u, ...prev]);
    setShowSignup(false);
    setSignupForm({ name: "", role: "Lawyer", password: "" });
    alert("Signup saved locally — use Login (prototype)");
  };

  const login = () => {
    if (!loginName.trim() || !loginPassword.trim()) return alert("Enter name and password");
    const found = users.find((u) => u.name.toLowerCase() === loginName.trim().toLowerCase() && u.password === loginPassword);
    if (!found) return alert("Invalid credentials (prototype)");
    setUser({ name: found.name, role: found.role });
    setLoginName("");
    setLoginPassword("");
  };

  const logout = () => {
    setUser(null);
  };

  // small fake AI helpers
  const fakeAiResponse = (prompt, context = {}) => {
    if (!prompt) return "...";
    const p = prompt.toLowerCase();
    if (p.includes("summarize")) return `Summary — ${context.caseTitle || "No case"}: ${context.shortFacts || "No facts provided."}`;
    if (p.includes("advice") || p.includes("what should")) return `Legal Assistant: Based on the facts, consider documenting evidence and reviewing statutory provisions.`;
    if (p.includes("evaluate") || p.includes("decide")) return `Ruling: In favor of ${context.favored || "plaintiff"}\nReasoning: The record indicates breach of duty supported by exhibits.`;
    return `AI: (Simulated) I can help with: "${prompt}"`;
  };

  // drawer helpers
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  // case helpers
  useEffect(() => {
    if (!selectedCaseId && cases.length) setSelectedCaseId(cases[0].id);
  }, [cases, selectedCaseId]);

  const selectCase = (id) => {
    setSelectedCaseId(id);
    if (window.innerWidth < 900) closeDrawer(); // helpful on small screens
  };

  const createCase = (c) => {
    setCases((prev) => [c, ...prev]);
    setSelectedCaseId(c.id);
  };

  // small UI components below (kept inline for single-file simplicity)
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="logo">AI</div>
            <div>
              <div className="title">AI Judicial Suite</div>
              <div className="subtitle">Assistant • Lawyer • Judge — AI-powered legal automation platform</div>
            </div>
          </div>

          <nav className="nav-area">
            {/* desktop nav */}
            <div className="nav-desktop">
              <NavButton label="AI Assistant" sub="Landing & legal help" active={route === "assistant"} onClick={() => setRoute("assistant")} />
              <NavButton label="AI Lawyer" sub="Case drafting & arguments" active={route === "lawyer"} onClick={() => setRoute("lawyer")} />
              <NavButton label="AI Judge" sub="Rulings & reasoning" active={route === "judge"} onClick={() => setRoute("judge")} />
            </div>

            {/* mobile hamburger */}
            <div className="nav-mobile">
              <button className="hamburger" onClick={openDrawer} aria-label="Open menu">☰</button>
            </div>
          </nav>

          {/* login group - desktop (moved under nav on small screens via CSS) */}
          <div className="auth-desktop">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            {!user ? (
              <div className="auth-form">
                <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Your name" />
                <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" type="password" />
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                  <option>Judge</option>
                  <option>Lawyer</option>
                  <option>Legal Assistant</option>
                  <option>Public</option>
                </select>
                <button className="btn primary" onClick={login}>Login</button>
                <button className="btn" onClick={() => setShowSignup(true)}>Signup</button>
              </div>
            ) : (
              <div className="signed-in">
                <div className="signed-text">Signed in: <strong>{user.name}</strong> <span className="small">({user.role})</span></div>
                <button className="btn" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* mobile login area (visible on small screens) */}
        <div className="auth-mobile">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          {!user ? (
            <div className="auth-form mobile">
              <input value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Your name" />
              <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" type="password" />
              <div className="row">
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                  <option>Judge</option>
                  <option>Lawyer</option>
                  <option>Legal Assistant</option>
                  <option>Public</option>
                </select>
                <button className="btn primary" onClick={login}>Login</button>
              </div>
              <button className="btn green" onClick={() => setShowSignup(true)}>Signup</button>
            </div>
          ) : (
            <div className="signed-in mobile">
              <div>Signed in: <strong>{user.name}</strong> <span className="small">({user.role})</span></div>
              <button className="btn" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Off-canvas Drawer (mobile) */}
      <Drawer open={drawerOpen} onClose={closeDrawer}>
        <div className="drawer-links">
          <button className={`drawer-link ${route === "assistant" ? "active" : ""}`} onClick={() => { setRoute("assistant"); closeDrawer(); }}>AI Assistant</button>
          <button className={`drawer-link ${route === "lawyer" ? "active" : ""}`} onClick={() => { setRoute("lawyer"); closeDrawer(); }}>AI Lawyer</button>
          <button className={`drawer-link ${route === "judge" ? "active" : ""}`} onClick={() => { setRoute("judge"); closeDrawer(); }}>AI Judge</button>

          <div className="drawer-cases">
            <div className="drawer-sub">Quick cases</div>
            {cases.map((c) => (
              <button key={c.id} className={`case-quick ${selectedCaseId === c.id ? "selected" : ""}`} onClick={() => selectCase(c.id)}>{c.title}</button>
            ))}
          </div>
        </div>
      </Drawer>

      <main className="main">
        <div className="container">
          {route === "assistant" && (
            <LandingAssistant
              user={user}
              setRoute={setRoute}
              cases={cases}
              setCases={setCases}
              selectedCaseId={selectedCaseId}
              setSelectedCaseId={setSelectedCaseId}
              assistantHistory={assistantHistory}
              setAssistantHistory={setAssistantHistory}
              fakeAiResponse={fakeAiResponse}
            />
          )}

          {route === "lawyer" && (
            <LawyerPage
              user={user}
              cases={cases}
              setCases={setCases}
              selectedCaseId={selectedCaseId}
              setSelectedCaseId={setSelectedCaseId}
              assistantHistory={assistantHistory}
              setAssistantHistory={setAssistantHistory}
              fakeAiResponse={fakeAiResponse}
            />
          )}

          {route === "judge" && (
            <JudgePage
              user={user}
              cases={cases}
              setCases={setCases}
              selectedCaseId={selectedCaseId}
              setSelectedCaseId={setSelectedCaseId}
              fakeAiResponse={fakeAiResponse}
              userObj={user}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container small">
          {/* Replace this notice text as you like */}
          <div className="footer-note">AI Judicial Suite — this site uses a mocked AI and client-side auth for demonstration. Replace with secure backend & audited models in production.</div>
        </div>
      </footer>

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-backdrop" onClick={() => setShowSignup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Signup (prototype)</h3>
            <input value={signupForm.name} onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" />
            <select value={signupForm.role} onChange={(e) => setSignupForm((p) => ({ ...p, role: e.target.value }))}>
              <option>Lawyer</option>
              <option>Judge</option>
              <option>Legal Assistant</option>
              <option>Public</option>
            </select>
            <input value={signupForm.password} onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" type="password" />
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowSignup(false)}>Cancel</button>
              <button className="btn green" onClick={signup}>Create account</button>
            </div>
            <div className="small muted">This signup stores accounts locally (prototype). Use a secure back-end in production.</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------
   Small helper components
   ------------------------- */

function NavButton({ label, sub, active, onClick }) {
  return (
    <button className={`nav-btn ${active ? "active" : ""}`} onClick={onClick}>
      <div className="nav-btn-title">{label}</div>
      <div className="nav-btn-sub">{sub}</div>
    </button>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

function Drawer({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="drawer-root" role="dialog" aria-modal="true">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">{children}</div>
    </div>
  );
}

/* -------------------------
   Landing Assistant Page
   ------------------------- */

function LandingAssistant({
  user,
  setRoute,
  cases,
  setCases,
  selectedCaseId,
  setSelectedCaseId,
  assistantHistory,
  setAssistantHistory,
  fakeAiResponse,
}) {
  const [prompt, setPrompt] = useState("");
  const [localChat, setLocalChat] = useState([]);

  const askAssistant = () => {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    const resp = fakeAiResponse(q, { caseTitle: cases.find((c) => c.id === selectedCaseId)?.title, shortFacts: cases.find((c) => c.id === selectedCaseId)?.description?.slice(0, 120) });
    const userMsg = { id: Date.now() + "-u", from: user?.name || "Guest", text: q, ts: Date.now() };
    const botMsg = { id: Date.now() + "-b", from: "AI Assistant", text: resp, ts: Date.now() + 1 };
    setLocalChat((prev) => [...prev, userMsg, botMsg]);
    if (selectedCaseId) setAssistantHistory((prev) => ({ ...prev, [selectedCaseId]: [...(prev[selectedCaseId] || []), userMsg, botMsg] }));
    setPrompt("");
  };

  return (
    <section className="grid two-col">
      <div className="card large">
        <h2>Meet your AI Legal Assistant</h2>
        <p className="muted">Ask legal questions, summarize documents, draft notices, or get case-specific guidance. Fast, explainable, transparent.</p>

        <div className="benefits">
          <div className="info">Context-aware<div className="muted small">Assistant uses selected case facts when available.</div></div>
          <div className="info">Explainable<div className="muted small">Responses include reasoning you can review.</div></div>
          <div className="info">Transparent<div className="muted small">All chats and logs are stored per case.</div></div>
        </div>

        <div className="ask-row">
          <input className="wide-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask the AI assistant (e.g. summarize evidence)" />
          <button className="btn primary" onClick={askAssistant}>Ask</button>
        </div>

        <div className="chat-box">
          {localChat.length === 0 ? <div className="muted small">No conversations yet — ask a question above.</div> : localChat.map((m) => (
            <div className={`chat-item ${m.from === "AI Assistant" ? "ai" : "user"}`} key={m.id}>
              <div className="chat-meta">{m.from} • {new Date(m.ts).toLocaleTimeString()}</div>
              <div className="chat-text">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="card-actions">
          <button className="btn" onClick={() => setRoute("lawyer")}>Open AI Lawyer</button>
          <button className="btn primary" onClick={() => setRoute("judge")}>Open AI Judge</button>
        </div>
      </div>

      <aside className="card sidebar">
        <div className="section">
          <div className="section-title">Quick select case</div>
          {cases.map((c) => (
            <button key={c.id} className={`case-select ${selectedCaseId === c.id ? "selected" : ""}`} onClick={() => setSelectedCaseId(c.id)}>{c.title}</button>
          ))}
        </div>

        <div className="section">
          <div className="section-title">Account</div>
          <div className="muted small">Sign in to access role-specific tools</div>
          <button className="btn green" onClick={() => alert("Sign in from top bar (prototype)")}>Signup</button>
        </div>

        <div className="section">
          <div className="section-title">Why use the Assistant</div>
          <ul className="muted small">
            <li>Drafts & templates</li>
            <li>Context-aware Q&A</li>
            <li>Evidence summarization</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

/* -------------------------
   Lawyer Page
   ------------------------- */

function LawyerPage({ user, cases, setCases, selectedCaseId, setSelectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse }) {
  const [showNew, setShowNew] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", description: "", tags: "" });
  const [message, setMessage] = useState("");

  const submitCase = () => {
    if (!newCase.title.trim()) return alert("Title required");
    const id = "CASE-" + (cases.length + 1).toString().padStart(3, "0");
    const c = { id, title: newCase.title, description: newCase.description, tags: newCase.tags.split(",").map((t) => t.trim()).filter(Boolean), evidence: [], status: "Submitted", timeline: [{ ts: Date.now(), actor: user?.name || "Anon", action: "Submitted case" }], messages: [], ruling: null };
    setCases((prev) => [c, ...prev]);
    setShowNew(false);
    setNewCase({ title: "", description: "", tags: "" });
    setSelectedCaseId(c.id);
  };

  const sendMessage = (to = "All") => {
    if (!message.trim()) return;
    const msg = { id: Date.now().toString(), from: (user?.role || "Lawyer") + ":" + (user?.name || "Anon"), to, text: message, ts: Date.now() };
    setCases((prev) => prev.map((c) => c.id === selectedCaseId ? { ...c, messages: [...c.messages, msg], timeline: [...c.timeline, { ts: Date.now(), actor: msg.from, action: `Message to ${to}` }] } : c));
    setMessage("");
  };

  return (
    <section className="grid two-col">
      <div className="card large">
        <div className="flex-between">
          <h2>AI Lawyer Workspace</h2>
          <div className="muted small">Cases: {cases.length}</div>
        </div>

        <div className="lawyer-grid">
          <div className="left-col">
            <div className="muted small">My cases</div>
            <div className="cases-list">
              {cases.map((c) => (
                <div key={c.id} className={`case-row ${selectedCaseId === c.id ? "active" : ""}`}>
                  <div>
                    <div className="case-title">{c.title}</div>
                    <div className="muted tiny">{c.id}</div>
                  </div>
                  <div>
                    <button className="btn" onClick={() => setSelectedCaseId(c.id)}>Open</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2"><button className="btn primary" onClick={() => setShowNew(true)}>+ New Case</button></div>
          </div>

          <div className="right-col">
            {selectedCaseId ? (
              <>
                <h3>{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                <p className="muted">{cases.find((c) => c.id === selectedCaseId)?.description}</p>

                <div className="card panel">
                  <div className="muted small">Messages</div>
                  <div className="messages-scroll">
                    {cases.find((c) => c.id === selectedCaseId)?.messages.map((m) => (
                      <div key={m.id} className="msg">
                        <div className="muted tiny">{m.from} • {new Date(m.ts).toLocaleTimeString()}</div>
                        <div>{m.text}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 row">
                    <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1" placeholder="Write message or ask assistant" />
                    <button className="btn primary" onClick={() => sendMessage("All")}>Send</button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="muted small">Assistant chat (case-aware)</div>
                  <CaseAssistant selectedCaseId={selectedCaseId} assistantHistory={assistantHistory} setAssistantHistory={setAssistantHistory} fakeAiResponse={fakeAiResponse} />
                </div>
              </>
            ) : (
              <div className="muted">Select a case to view details.</div>
            )}
          </div>
        </div>

        {showNew && (
          <div className="panel mt-3">
            <h4>Submit case</h4>
            <input value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} placeholder="Title" />
            <textarea value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} placeholder="Description" />
            <input value={newCase.tags} onChange={(e) => setNewCase({ ...newCase, tags: e.target.value })} placeholder="tags" />
            <div className="mt-2">
              <button className="btn green" onClick={submitCase}>Submit</button>
              <button className="btn" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <aside className="card sidebar">
        <div className="section-title">Quick tools</div>
        <div className="muted small">Draft notice (AI)</div>
        <div className="muted small">Summarize evidence</div>
        <div className="muted small">Generate checklist</div>
      </aside>
    </section>
  );
}

function CaseAssistant({ selectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse }) {
  const [prompt, setPrompt] = useState("");
  const messages = assistantHistory[selectedCaseId] || [];

  const ask = () => {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    const resp = fakeAiResponse(q, { caseTitle: "", shortFacts: "" });
    const u = { id: Date.now() + "-u", from: "User", text: q, ts: Date.now() };
    const b = { id: Date.now() + "-b", from: "AI Assistant", text: resp, ts: Date.now() + 1 };
    setAssistantHistory((prev) => ({ ...prev, [selectedCaseId]: [...(prev[selectedCaseId] || []), u, b] }));
    setPrompt("");
  };

  return (
    <div className="case-assistant">
      <div className="messages-scroll small muted">
        {messages.length === 0 ? <div className="muted tiny">No assistant messages for this case.</div> : messages.map((m) => (
          <div key={m.id} className="mb-2">
            <div className="muted tiny">{m.from}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="row mt-2">
        <input className="flex-1" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask about this case..." />
        <button className="btn primary" onClick={ask}>Ask</button>
      </div>
    </div>
  );
}

/* -------------------------
   Judge Page
   ------------------------- */

function JudgePage({ user, cases, setCases, selectedCaseId, setSelectedCaseId, fakeAiResponse, userObj }) {
  const [favored, setFavored] = useState("plaintiff");

  const evaluate = () => {
    if (!userObj || userObj.role !== "Judge") return alert("Sign in as Judge to evaluate.");
    const sc = cases.find((c) => c.id === selectedCaseId);
    if (!sc) return alert("Select a case");
    const resp = fakeAiResponse("Evaluate and decide", { favored, caseTitle: sc.title });
    const ruling = { id: "R-" + Date.now(), text: resp, ts: Date.now(), judge: userObj.name };
    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, ruling, status: "Ruled", timeline: [...c.timeline, { ts: Date.now(), actor: "Judge:" + userObj.name, action: "Issued ruling" }] } : c)));
  };

  return (
    <section className="grid two-col">
      <div className="card large">
        <div className="flex-between">
          <h2>AI Judge Chamber</h2>
          <div className="muted small">Role tools for Judges</div>
        </div>

        <div className="lawyer-grid">
          <div className="left-col">
            <div className="muted small">Cases</div>
            <div className="cases-list">
              {cases.map((c) => (
                <div key={c.id} className={`case-row ${selectedCaseId === c.id ? "active" : ""}`}>
                  <div>
                    <div className="case-title">{c.title}</div>
                    <div className="muted tiny">{c.id}</div>
                  </div>
                  <div>
                    <button className="btn" onClick={() => setSelectedCaseId(c.id)}>Open</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-col">
            {selectedCaseId ? (
              <>
                <h3>{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                <p className="muted">{cases.find((c) => c.id === selectedCaseId)?.description}</p>

                <div className="panel">
                  <div className="muted small">Adjudicate</div>
                  <div className="row mt-2 items-center">
                    <label className="muted tiny">Favor</label>
                    <select value={favored} onChange={(e) => setFavored(e.target.value)}>
                      <option value="plaintiff">Plaintiff</option>
                      <option value="defendant">Defendant</option>
                      <option value="split">Split / Partial</option>
                    </select>
                    <button className="btn green" onClick={evaluate}>Evaluate</button>
                  </div>

                  <div className="mt-3">
                    <div className="muted small">Last ruling</div>
                    <div className="boxed mt-2">{cases.find((c) => c.id === selectedCaseId)?.ruling?.text || "— No ruling yet"}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="muted small">Timeline</div>
                  <div className="messages-scroll mt-2">
                    {cases.find((c) => c.id === selectedCaseId)?.timeline.slice().reverse().map((t, idx) => (<div key={idx} className="muted tiny border-bottom">{new Date(t.ts).toLocaleString()} — <strong>{t.actor}</strong> — {t.action}</div>))}
                  </div>
                </div>
              </>
            ) : (<div className="muted">Select a case to adjudicate.</div>)}
          </div>
        </div>
      </div>

      <aside className="card sidebar">
        <div className="section-title">Judge toolkit</div>
        <div className="muted small">Precedent search (mock)</div>
        <div className="muted small">Evidence weight calculator (mock)</div>
        <div className="muted small">Explainability panel</div>
      </aside>
    </section>
  );
}
