import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * src/App.jsx
 * AI Judicial Suite — Responsive Front-end Prototype
 *
 * Updated: Fixed mobile width overflow issues in Navbar and Judge controls.
 */

/* ---------- Small mocked AI helper ---------- */
function fakeAiResponse(prompt, context = {}) {
  if (!prompt) return "...";
  const p = prompt.toLowerCase();
  if (p.includes("summarize")) return `Summary — ${context.caseTitle || "No case"}: ${context.shortFacts || "No facts provided."}`;
  if (p.includes("advice") || p.includes("what should")) return `Legal Assistant: Based on the facts, consider documenting evidence and reviewing statutory provisions relevant to the claim.`;
  if (p.includes("evaluate") || p.includes("decide")) return `Ruling: In favor of ${context.favored || "plaintiff"}
Reasoning: The record indicates breach of duty supported by exhibits.
Order: Remedies as appropriate.`;
  return `AI: (Simulated) I can help with: "${prompt}"`;
}

/* ---------- Main App component ---------- */
export default function AIJudicialApp() {
  const [route, setRoute] = useState("assistant"); // assistant | lawyer | judge
  const [user, setUser] = useState(null);

  // Mocked client-side users
  const [users, setUsers] = useState(() => [
    { name: 'Judge Judy', role: 'Judge', password: 'judgepass' },
    { name: 'Lawyer John', role: 'Lawyer', password: 'lawyerpass' },
    { name: 'Assistant Mary', role: 'Legal Assistant', password: 'assistant123' },
    { name: 'Public User', role: 'Public', password: 'public123' }
  ]);

  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState("Lawyer");
  const [loginPassword, setLoginPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ name: "", role: "Lawyer", password: "" });

  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState("dark");

  // Ensure <html> receives .dark when theme==='dark' so global CSS works
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
  }, [theme]);

  // Cases + UI state
  const [cases, setCases] = useState(() => sampleCases());
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || null);
  const [assistantHistory, setAssistantHistory] = useState({});

  useEffect(() => {
    if (!selectedCaseId && cases[0]) setSelectedCaseId(cases[0].id);
  }, [cases, selectedCaseId]);

  // Auth handlers (mock)
  const signup = () => {
    const { name, role, password } = signupForm;
    if (!name.trim() || !password.trim()) return alert("Please provide name and password");
    if (users.find((u) => u.name.toLowerCase() === name.trim().toLowerCase())) return alert("User already exists (prototype)");
    const u = { name: name.trim(), role, password };
    setUsers((prev) => [u, ...prev]);
    setShowSignup(false);
    setSignupForm({ name: "", role: "Lawyer", password: "" });
    alert("Signup successful — you can now login (prototype)");
  };

  const login = () => {
    if (!loginName.trim() || !loginPassword.trim()) return alert("Enter name and password");
    const found = users.find((u) => u.name.toLowerCase() === loginName.trim().toLowerCase() && u.password === loginPassword);
    if (!found) return alert("Invalid credentials (prototype)");
    setUser({ name: found.name, role: found.role });
    setLoginName("");
    setLoginPassword("");
  };

  const logout = () => setUser(null);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // nav helper
  const navItem = (key, label, desc) => (
    <button
      onClick={() => setRoute(key)}
      className={`flex-1 p-3 rounded-lg text-left hover:shadow-lg transition-shadow ${route === key ? "bg-gradient-to-r from-indigo-600 to-purple-500 text-white" : `${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"}`}`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs opacity-80">{desc}</div>
    </button>
  );

  return (
    // wrapper: theme class 'dark' or 'light' (used by App.css)
    <div className={`app-root ${theme === "dark" ? "dark" : "light"}`}>
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-900"}`}>
        <nav className="max-w-6xl mx-auto py-6 px-4 flex flex-wrap items-center justify-between relative gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">AI</div>
            <div>
              <h1 className="text-2xl font-bold">AI Judicial Suite</h1>
              <div className="text-sm text-gray-600 dark:text-gray-300">Assistant • Lawyer • Judge — interactive</div>
            </div>
          </div>

          {/* Right Nav Section */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="hidden md:flex gap-2 max-w-[680px] flex-1">
              {navItem("assistant", "AI Assistant", "Landing & legal help")}
              {navItem("lawyer", "AI Lawyer", "Case drafting & arguments")}
              {navItem("judge", "AI Judge", "Rulings & reasoning")}
            </div>

            <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto">
              <button onClick={toggleTheme} className={`px-3 py-2 rounded-lg border shadow-sm ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm">Signed in: <strong>{user.name}</strong> <span className="text-xs text-gray-500 dark:text-gray-300">({user.role})</span></div>
                  <button onClick={logout} className="px-3 py-1 rounded bg-white dark:bg-gray-800 shadow-sm">Logout</button>
                </div>
              ) : (
                /* --- FIX: Added flex-wrap and responsive width classes (w-full sm:w-auto) --- */
                <div className={`flex flex-wrap items-center justify-end gap-2 rounded p-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm w-full md:w-auto`}>
                  <input 
                    value={loginName} 
                    onChange={(e) => setLoginName(e.target.value)} 
                    placeholder="Your name" 
                    className={`w-full sm:w-auto px-2 py-1 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} 
                  />
                  <input 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    placeholder="Password" 
                    type="password" 
                    className={`w-full sm:w-auto px-2 py-1 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} 
                  />
                  <select 
                    value={loginRole} 
                    onChange={(e) => setLoginRole(e.target.value)} 
                    className={`w-full sm:w-auto px-2 py-1 border rounded max-w-full sm:max-w-[160px] ${theme === "dark" ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
                  >
                    <option>Judge</option>
                    <option>Lawyer</option>
                    <option>Legal Assistant</option>
                    <option>Public</option>
                  </select>
                  
                  {/* Buttons wrapper for better mobile stacking */}
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button onClick={login} className="flex-1 sm:flex-none px-3 py-1 rounded bg-indigo-600 text-white">Login</button>
                    <button onClick={() => setShowSignup(true)} className="flex-1 sm:flex-none px-3 py-1 rounded bg-green-500 text-white">Signup</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 pb-12">
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
              theme={theme}
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
              theme={theme}
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
              theme={theme}
            />
          )}
        </main>

        <footer className="mt-8 py-6 border-t bg-white/60 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <div className="font-medium">AI Judicial Suite</div>
            <div>
              This platform provides AI-assisted legal tools and information and is <strong>not</strong> a substitute for professional legal advice.
              Use of the service is subject to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
            </div>
            <div>
              Do not submit confidential, privileged, or sensitive data unless you have explicit authorization.
              For general support or to report security issues, email <a href="mailto:support@example.com" className="underline">aijudicialsuite@example.com</a>.
            </div>
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} AI Judicial Suite. All rights reserved.</div>
          </div>
        </footer>
      </div>

      {/* Signup modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded p-6 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <h3 className="text-lg font-semibold">Signup (prototype)</h3>
            <div className="mt-3 space-y-2">
              <input value={signupForm.name} onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" className={`w-full px-3 py-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : ""}`} />
              <select value={signupForm.role} onChange={(e) => setSignupForm((p) => ({ ...p, role: e.target.value }))} className={`w-full px-3 py-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : ""}`}>
                <option>Lawyer</option>
                <option>Judge</option>
                <option>Legal Assistant</option>
                <option>Public</option>
              </select>
              <input value={signupForm.password} onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" type="password" className={`w-full px-3 py-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : ""}`} />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowSignup(false)} className="px-3 py-2 rounded border">Cancel</button>
              <button onClick={signup} className="px-3 py-2 rounded bg-green-500 text-white">Create account</button>
            </div>

            <div className="mt-3 text-xs text-gray-500">Note: This is a client-side prototype. Do not use these credentials for real accounts.</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Landing / Assistant Page ---------------- */
function LandingAssistant({ user, setRoute, cases, setCases, selectedCaseId, setSelectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse, theme }) {
  const [prompt, setPrompt] = useState("");
  const [localChat, setLocalChat] = useState([]);

  const askAssistant = () => {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    const resp = fakeAiResponse(q, {
      caseTitle: cases.find((c) => c.id === selectedCaseId)?.title,
      shortFacts: cases.find((c) => c.id === selectedCaseId)?.description?.slice(0, 120),
    });
    const userMsg = { id: Date.now() + "-u", from: user?.name || "Guest", text: q, ts: Date.now() };
    const botMsg = { id: Date.now() + "-b", from: "AI Assistant", text: resp, ts: Date.now() + 1 };
    setLocalChat((p) => [...p, userMsg, botMsg]);
    if (selectedCaseId) setAssistantHistory((p) => ({ ...p, [selectedCaseId]: [...(p[selectedCaseId] || []), userMsg, botMsg] }));
    setPrompt("");
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`lg:col-span-2 rounded-2xl p-8 shadow-xl ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold">Meet your AI Legal Assistant</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">Ask legal questions, summarize documents, draft notices, or get case-specific guidance. Fast, explainable, and transparent — prototype only.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-700" : "bg-indigo-50"}`}>
                <div className="text-sm font-semibold">Context-aware</div>
                <div className="text-xs text-gray-500 mt-1">Assistant uses selected case facts when available.</div>
              </div>
              <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-700" : "bg-green-50"}`}>
                <div className="text-sm font-semibold">Explainable</div>
                <div className="text-xs text-gray-500 mt-1">Responses include reasoning you can review.</div>
              </div>
              <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-700" : "bg-yellow-50"}`}>
                <div className="text-sm font-semibold">Transparent</div>
                <div className="text-xs text-gray-500 mt-1">All chats and logs are stored per case.</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex gap-2">
                <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask the AI assistant (e.g. summarize evidence)" className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : ""}`} />
                <button onClick={askAssistant} className="px-5 py-3 rounded-lg bg-indigo-600 text-white shadow">Ask</button>
              </div>

              <div className="mt-4 max-h-56 overflow-auto rounded p-3" style={{ background: theme === "dark" ? "#0b1220" : "#F3F4F6" }}>
                {localChat.length === 0 ? <div className="text-sm text-gray-500">No conversations yet — ask a question above.</div> : (
                  localChat.map((m) => (
                    <div key={m.id} className={`mb-3 ${m.from === "AI Assistant" ? "text-right" : ""}`}>
                      <div className="text-xs text-gray-500">{m.from} • {new Date(m.ts).toLocaleTimeString()}</div>
                      <div className={`mt-1 inline-block p-3 rounded-lg ${m.from === "AI Assistant" ? "bg-indigo-600 text-white" : "bg-white border"}`}>{m.text}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => setRoute("lawyer")} className="px-4 py-2 rounded-lg border">Open AI Lawyer</button>
                <button onClick={() => setRoute("judge")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">Open AI Judge</button>
              </div>
            </div>
          </div>

          <div className="w-64 hidden lg:block">
            <div className={`panel p-4 rounded-xl shadow-inner ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="text-xs text-gray-500">Quick select case</div>
              <div className="mt-3 space-y-2">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`case-card w-full text-left p-2 rounded ${selectedCaseId === c.id ? "case-selected" : ""}`}
                    title={c.title}
                  >
                    <div className="text-sm truncate font-medium">{c.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.id}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <aside className="space-y-4">
        <div className={`rounded-2xl p-4 shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"}`}>
          <div className="font-semibold mb-2">Account</div>
          {!user ? (
            <div>
              <p className="text-xs text-gray-600 mb-2">You are not signed in.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowSignup(true)} className="px-3 py-2 rounded bg-green-500 text-white w-full">Signup</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-600 mb-2">Signed in as <strong>{user.name}</strong></p>
              <button onClick={() => alert("Profile (prototype)")} className="px-3 py-2 rounded bg-white w-full">Profile</button>
            </div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className={`rounded-2xl p-4 shadow ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="text-sm text-gray-500">Why use the Assistant</div>
          <ul className="mt-3 text-sm list-disc ml-5 text-gray-700 dark:text-gray-300">
            <li>Drafts & templates</li>
            <li>Context-aware Q&A</li>
            <li>Evidence summarization</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className={`panel rounded-2xl p-4 shadow-lg ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to-gray-800 text-white" : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"}`}>
          <div className="font-semibold">Get started</div>
          <div className="text-xs mt-2">Sign in as Lawyer / Judge / Assistant to access role-specific tools.</div>
          <div className="mt-3"><button onClick={() => alert("Sign in from top-right (prototype)")} className={`px-3 py-2 rounded ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-indigo-700"}`}>Sign in</button></div>
        </motion.div>
      </aside>
    </section>
  );
}

/* ---------------- Lawyer Page ---------------- */
function LawyerPage({ user, cases, setCases, selectedCaseId, setSelectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse, theme }) {
  const [showNew, setShowNew] = useState(false);
  const [newCase, setNewCase] = useState({ title: "", description: "", tags: "" });
  const [message, setMessage] = useState("");

  const submitCase = () => {
    if (!newCase.title.trim()) return alert("Title required");
    const id = "CASE-" + (cases.length + 1).toString().padStart(3, "0");
    const c = { id, title: newCase.title, description: newCase.description, tags: newCase.tags.split(",").map((t) => t.trim()).filter(Boolean), evidence: [], status: "Submitted", timeline: [{ ts: Date.now(), actor: user?.name || "Anon", action: "Submitted case" }], messages: [], ruling: null };
    setCases((p) => [c, ...p]);
    setShowNew(false);
    setNewCase({ title: "", description: "", tags: "" });
    setSelectedCaseId(c.id);
  };

  const sendMessage = (to = "All") => {
    if (!message.trim()) return;
    const msg = { id: Date.now().toString(), from: (user?.role || "Lawyer") + ":" + (user?.name || "Anon"), to, text: message, ts: Date.now() };
    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, messages: [...c.messages, msg], timeline: [...c.timeline, { ts: Date.now(), actor: msg.from, action: `Message to ${to}` }] } : c)));
    setMessage("");
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-2 rounded-2xl p-6 shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">AI Lawyer Workspace</h2>
          <div className="text-sm text-gray-500">Cases: {cases.length}</div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="w-64 hidden md:block">
            <div className="text-xs text-gray-500">My cases</div>
            <div className="mt-2 space-y-2">
              {cases.map((c) => (
                <div key={c.id} className={`p-2 rounded flex items-center gap-3 ${selectedCaseId === c.id ? (theme === "dark" ? "bg-indigo-600/40 text-white border-indigo-600/30" : "bg-indigo-50 border") : (theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border")}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate font-medium" title={c.title}>{c.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.id}</div>
                  </div>

                  <button onClick={() => setSelectedCaseId(c.id)} className={`case-open-btn rounded border ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`} aria-label={`Open ${c.title}`}>Open</button>
                </div>
              ))}
            </div>
            <div className="mt-3"><button onClick={() => setShowNew(true)} className="px-3 py-2 rounded bg-indigo-600 text-white">+ New Case</button></div>
          </div>
          
          {/* Mobile Case List Fallback */}
          <div className="md:hidden w-full mb-4">
            <select className="w-full p-2 border rounded" onChange={(e) => setSelectedCaseId(e.target.value)} value={selectedCaseId || ""}>
                {cases.map(c => <option key={c.id} value={c.id}>{c.id} - {c.title}</option>)}
            </select>
          </div>

          <div className="flex-1">
            {selectedCaseId ? (
              <div>
                <h3 className="font-semibold">{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{cases.find((c) => c.id === selectedCaseId)?.description}</p>

                <div className={`mt-4 p-4 rounded ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50"}`}>
                  <div className="text-xs text-gray-500">Messages</div>
                  <div className="max-h-36 overflow-auto mt-2 space-y-2">
                    {cases.find((c) => c.id === selectedCaseId)?.messages.map((m) => (
                      <div key={m.id} className="p-2 rounded bg-white border text-sm"><div className="text-xs text-gray-400">{m.from} • {new Date(m.ts).toLocaleTimeString()}</div><div className="mt-1">{m.text}</div></div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write message or ask assistant" className={`flex-1 px-3 py-2 rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : ""}`} />
                    <button onClick={() => sendMessage("All")} className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500">Assistant chat (case-aware)</div>
                  <CaseAssistant selectedCaseId={selectedCaseId} assistantHistory={assistantHistory} setAssistantHistory={setAssistantHistory} fakeAiResponse={fakeAiResponse} theme={theme} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Select a case to view details.</div>
            )}
          </div>
        </div>

        {showNew && (
          <div className={`mt-6 p-4 rounded ${theme === "dark" ? "bg-gray-800" : "bg-white"} border`}>
            <h4 className="font-semibold">Submit case</h4>
            <input value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} placeholder="Title" className="w-full mt-2 px-3 py-2 border rounded" />
            <textarea value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} placeholder="Description" className="w-full mt-2 px-3 py-2 border rounded" />
            <input value={newCase.tags} onChange={(e) => setNewCase({ ...newCase, tags: e.target.value })} placeholder="tags" className="w-full mt-2 px-3 py-2 border rounded" />
            <div className="mt-2 flex gap-2"><button onClick={submitCase} className="px-3 py-2 rounded bg-green-500 text-white">Submit</button><button onClick={() => setShowNew(false)} className="px-3 py-2 rounded border">Cancel</button></div>
          </div>
        )}
      </div>

      <aside className={`rounded-2xl p-4 shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"}`}>
        <div className="text-sm font-semibold">Quick tools</div>
        <div className="mt-3 space-y-2 text-sm">
          <div className={`${theme === "dark" ? "bg-indigo-900/20 text-indigo-100 p-2 rounded" : "bg-indigo-50 text-indigo-900 p-2 rounded"}`}>Draft notice (AI)</div>
          <div className={`${theme === "dark" ? "bg-green-900/10 text-green-100 p-2 rounded" : "bg-green-50 text-green-900 p-2 rounded"}`}>Summarize evidence</div>
          <div className={`${theme === "dark" ? "bg-yellow-900/10 text-yellow-100 p-2 rounded" : "bg-yellow-50 text-yellow-900 p-2 rounded"}`}>Generate checklist</div>
        </div>
      </aside>
    </section>
  );
}

/* ---------------- Case Assistant ---------------- */
function CaseAssistant({ selectedCaseId, assistantHistory, setAssistantHistory, fakeAiResponse, theme }) {
  const [prompt, setPrompt] = useState("");
  const messages = assistantHistory[selectedCaseId] || [];
  const ask = () => {
    if (!prompt.trim()) return;
    const q = prompt.trim();
    const resp = fakeAiResponse(q, { caseTitle: "", shortFacts: "" });
    const u = { id: Date.now() + "-u", from: "User", text: q, ts: Date.now() };
    const b = { id: Date.now() + "-b", from: "AI Assistant", text: resp, ts: Date.now() + 1 };
    setAssistantHistory((p) => ({ ...p, [selectedCaseId]: [...(p[selectedCaseId] || []), u, b] }));
    setPrompt("");
  };

  return (
    <div className="mt-2">
      <div className={`max-h-32 overflow-auto rounded p-2 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        {messages.length === 0 ? <div className="text-xs text-gray-500">No assistant messages for this case.</div> : messages.map((m) => (<div key={m.id} className="text-sm mb-2"><div className="text-xs text-gray-400">{m.from}</div><div className="mt-1">{m.text}</div></div>))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`flex-1 px-3 py-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : ""}`} placeholder="Ask about this case..." />
        <button onClick={ask} className="px-3 py-2 rounded bg-indigo-600 text-white">Ask</button>
      </div>
    </div>
  );
}

/* ---------------- Judge Page ---------------- */
function JudgePage({ user, cases, setCases, selectedCaseId, setSelectedCaseId, fakeAiResponse, theme }) {
  const [favored, setFavored] = useState("plaintiff");

  const evaluate = () => {
    if (!user || user.role !== "Judge") return alert("Sign in as Judge to evaluate");
    const sc = cases.find((c) => c.id === selectedCaseId);
    if (!sc) return alert("Select a case");
    const resp = fakeAiResponse("Evaluate and decide", { favored, caseTitle: sc.title });
    const ruling = { id: "R-" + Date.now(), text: resp, ts: Date.now(), judge: user.name };
    setCases((prev) => prev.map((c) => (c.id === selectedCaseId ? { ...c, ruling, status: "Ruled", timeline: [...c.timeline, { ts: Date.now(), actor: "Judge:" + user.name, action: "Issued ruling" }] } : c)));
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-2 rounded-2xl p-6 shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">AI Judge Chamber</h2>
          <div className="text-sm text-gray-500">Role tools for Judges</div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="w-64 hidden md:block">
            <div className="text-xs text-gray-500">Cases</div>
            <div className="mt-2 space-y-2">
              {cases.map((c) => (
                <div key={c.id} className={`p-2 rounded flex items-center gap-3 ${selectedCaseId === c.id ? (theme === "dark" ? "bg-indigo-600/40 text-white border-indigo-600/30" : "bg-indigo-50 border") : (theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border")}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate font-medium" title={c.title}>{c.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{c.id}</div>
                  </div>
                  <button onClick={() => setSelectedCaseId(c.id)} className={`case-open-btn rounded border ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>Open</button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Case List Fallback */}
          <div className="md:hidden w-full mb-4">
            <select className="w-full p-2 border rounded" onChange={(e) => setSelectedCaseId(e.target.value)} value={selectedCaseId || ""}>
                {cases.map(c => <option key={c.id} value={c.id}>{c.id} - {c.title}</option>)}
            </select>
          </div>

          <div className="flex-1">
            {selectedCaseId ? (
              <div>
                <h3 className="font-semibold">{cases.find((c) => c.id === selectedCaseId)?.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{cases.find((c) => c.id === selectedCaseId)?.description}</p>

                <div className={`mt-4 p-4 rounded ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50"}`}>
                  <div className="text-sm font-semibold">Adjudicate</div>
                  
                  {/* --- FIX: Added flex-wrap and responsive width controls --- */}
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <label className="text-xs text-gray-600 w-full sm:w-auto">Favor</label>

                    <select
                      value={favored}
                      onChange={(e) => setFavored(e.target.value)}
                      className={`w-full sm:w-auto px-2 py-1 border rounded max-w-[220px] appearance-none ${theme === "dark" ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
                    >
                      <option value="plaintiff">Plaintiff</option>
                      <option value="defendant">Defendant</option>
                      <option value="split">Split / Partial</option>
                    </select>

                    <button onClick={evaluate} className="w-full sm:w-auto px-3 py-2 rounded bg-green-600 text-white">Evaluate</button>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Last ruling</div>
                    <div className={`mt-2 rounded p-3 border ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>{cases.find((c) => c.id === selectedCaseId)?.ruling?.text || "— No ruling yet"}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500">Timeline</div>
                  <div className={`mt-2 max-h-40 overflow-auto rounded p-2 border ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                    {cases.find((c) => c.id === selectedCaseId)?.timeline.slice().reverse().map((t, idx) => (<div key={idx} className="text-xs text-gray-600 border-b pb-2 mb-2">{new Date(t.ts).toLocaleString()} — <strong>{t.actor}</strong> — {t.action}</div>))}
                  </div>
                </div>
              </div>
            ) : (<div className="text-sm text-gray-500">Select a case to adjudicate.</div>)}
          </div>
        </div>
      </div>

      <aside className={`rounded-2xl p-4 shadow ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"}`}>
        <div className="text-sm font-semibold">Judge toolkit</div>
        <div className="mt-3 space-y-2 text-sm">
          <div className={`${theme === "dark" ? "bg-indigo-900/20 text-indigo-100 p-2 rounded" : "bg-indigo-50 text-indigo-900 p-2 rounded"}`}>Precedent search (mock)</div>
          <div className={`${theme === "dark" ? "bg-yellow-900/10 text-yellow-100 p-2 rounded" : "bg-yellow-50 text-yellow-900 p-2 rounded"}`}>Evidence weight calculator (mock)</div>
          <div className={`${theme === "dark" ? "bg-green-900/10 text-green-100 p-2 rounded" : "bg-green-50 text-green-900 p-2 rounded"}`}>Explainability panel</div>
        </div>
      </aside>
    </section>
  );
}

/* ---------------- Sample data ---------------- */
function sampleCases() {
  return [
    {
      id: "CASE-001",
      title: "Breach of Contract — Service Agreement",
      description:
        "Plaintiff claims Defendant failed to deliver contracted services within the agreed timeline. Key witnesses: A, B. Exhibit A: signed contract. Exhibit B: emails showing missed deadlines.",
      tags: ["contract", "civil"],
      evidence: [{ id: "ev1", name: "Exhibit A - Contract" }, { id: "ev2", name: "Exhibit B - Emails" }],
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