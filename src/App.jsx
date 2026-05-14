import { useState, useEffect, useRef } from "react";

const TOPICS = [
  { id: "crypto", label: "Crypto & Digital Assets", icon: "◈", query: "cryptocurrency Bitcoin Ethereum market news today 2026" },
  { id: "clarity", label: "CLARITY Act", icon: "⚖", query: "Digital Asset Market Clarity Act Senate latest news 2026" },
  { id: "stocks", label: "Stock Markets", icon: "📈", query: "stock market S&P 500 Nasdaq latest news today 2026" },
  { id: "macro", label: "Macro & Fed", icon: "🏛", query: "Federal Reserve interest rates inflation CPI GDP jobs macroeconomic global economy news 2026" },
  { id: "gems", label: "Hidden Gems", icon: "💎", query: "undervalued small cap stocks hidden gems high potential breakout 2026 under-the-radar stocks analysts recommend" },
  { id: "lowcap", label: "Low-Cap Rockets", icon: "🚀", query: "low cap small cap micro cap stocks about to explode breakout momentum high growth potential 2026" },
  { id: "macroworld", label: "Global Macro", icon: "🌐", query: "global macroeconomics geopolitics trade war tariffs currency dollar euro yuan oil commodities bonds yield curve 2026" },
  { id: "custom", label: "Custom Topic", icon: "✦", query: "" },
];

const INTERVALS = [
  { label: "Manual only", value: 0 },
  { label: "Every 5 min", value: 5 },
  { label: "Every 15 min", value: 15 },
  { label: "Every 30 min", value: 30 },
];

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function Ticker({ items }) {
  return (
    <div style={{
      overflow: "hidden", whiteSpace: "nowrap",
      borderBottom: "1px solid #1a2a1a", background: "#050d05",
      padding: "6px 0", fontSize: "11px", color: "#4a7a4a",
      letterSpacing: "0.08em", fontFamily: "'Courier New', monospace",
    }}>
      <span style={{ display: "inline-block", animation: "ticker 30s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} style={{ marginRight: "60px" }}>
            <span style={{ color: "#2a5a2a" }}>▸</span> {item}
          </span>
        ))}
      </span>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function PulseDot({ active }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 10, height: 10, marginRight: 6 }}>
      <span style={{
        display: "block", width: 8, height: 8, borderRadius: "50%",
        background: active ? "#00ff88" : "#1a3a1a",
        boxShadow: active ? "0 0 8px #00ff88" : "none",
        animation: active ? "pulse 1.5s ease-in-out infinite" : "none",
      }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>
    </span>
  );
}

function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", background: "#010801", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ maxWidth: 440, width: "100%" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#1a3a1a", marginBottom: 8 }}>
          MARKET INTELLIGENCE SYSTEM
        </div>
        <h1 style={{
          fontSize: 26, fontWeight: 700, letterSpacing: "0.1em",
          color: "#00ff88", textShadow: "0 0 20px rgba(0,255,136,0.3)",
          marginBottom: 32,
        }}>
          SENTINEL <span style={{ color: "#1a5a1a" }}>//</span> AI
        </h1>
        <div style={{ fontSize: 11, color: "#2a5a2a", marginBottom: 6, letterSpacing: "0.1em" }}>
          ANTHROPIC API KEY
        </div>
        <div style={{ position: "relative", marginBottom: 8 }}>
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{
              width: "100%", padding: "12px 44px 12px 14px",
              background: "#030a03", border: "1px solid #0f2a0f",
              color: "#7aaa7a", fontSize: 12, fontFamily: "monospace",
              outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = "#00ff88"}
            onBlur={e => e.target.style.borderColor = "#0f2a0f"}
          />
          <button onClick={() => setShow(!show)} style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "#1a4a1a", cursor: "pointer", fontSize: 14,
          }}>
            {show ? "🙈" : "👁"}
          </button>
        </div>
        <div style={{ fontSize: 10, color: "#1a3a1a", marginBottom: 24 }}>
          Get your key at console.anthropic.com → API Keys. Your key stays in your browser only.
        </div>
        <button
          onClick={() => { if (key.trim().startsWith("sk-")) { localStorage.setItem("sentinel_key", key.trim()); onSave(key.trim()); } }}
          disabled={!key.trim().startsWith("sk-")}
          style={{
            width: "100%", padding: "12px", background: key.startsWith("sk-") ? "rgba(0,255,136,0.08)" : "transparent",
            border: "1px solid", borderColor: key.startsWith("sk-") ? "#00ff88" : "#0f2a0f",
            color: key.startsWith("sk-") ? "#00ff88" : "#1a3a1a",
            fontSize: 12, cursor: key.startsWith("sk-") ? "pointer" : "not-allowed",
            letterSpacing: "0.1em", fontFamily: "monospace",
          }}
        >
          ▶ LAUNCH SENTINEL
        </button>
      </div>
    </div>
  );
}

function UpdateCard({ update, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const sentiment = update.sentiment || "neutral";
  const sentColor = sentiment === "bullish" ? "#00ff88" : sentiment === "bearish" ? "#ff4444" : "#888";
  const sentLabel = sentiment === "bullish" ? "▲ BULLISH" : sentiment === "bearish" ? "▼ BEARISH" : "◆ NEUTRAL";

  return (
    <div style={{
      border: "1px solid #0f2a0f", borderLeft: `3px solid ${sentColor}`,
      marginBottom: 12, background: "#030a03", cursor: "pointer",
    }} onClick={() => setExpanded(!expanded)}>
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: sentColor, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em" }}>{sentLabel}</span>
          <span style={{ color: "#2a4a2a", fontSize: 11 }}>{update.topic}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#1a3a1a", fontSize: 10, fontFamily: "monospace" }}>{timeAgo(update.timestamp)}</span>
          <span style={{ color: "#1a3a1a", fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #0a1a0a" }}>
          {update.tickers && update.tickers.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {update.tickers.map((t, i) => (
                <span key={i} style={{
                  padding: "3px 8px", border: "1px solid #00ff8844",
                  color: "#00ff88", fontSize: 10, fontFamily: "monospace",
                  letterSpacing: "0.1em", background: "rgba(0,255,136,0.04)",
                }}>
                  ${t}
                </span>
              ))}
            </div>
          )}
          <p style={{ color: "#7aaa7a", fontSize: 13, lineHeight: 1.7, margin: "12px 0 0", fontFamily: "'Georgia', serif" }}>
            {update.summary}
          </p>
          {update.bullets && (
            <ul style={{ margin: "12px 0 0", paddingLeft: 16 }}>
              {update.bullets.map((b, i) => (
                <li key={i} style={{ color: "#4a7a4a", fontSize: 12, lineHeight: 1.6, marginBottom: 4, fontFamily: "monospace" }}>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {update.catalyst && (
            <div style={{
              marginTop: 12, padding: "8px 12px",
              border: "1px solid #1a3a0a", background: "rgba(255,200,0,0.03)",
              borderLeft: "2px solid #ffcc00",
            }}>
              <span style={{ fontSize: 9, color: "#665500", letterSpacing: "0.15em" }}>KEY CATALYST / RISK  </span>
              <span style={{ fontSize: 11, color: "#998800", fontFamily: "monospace" }}>{update.catalyst}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("sentinel_key") || "");
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [customQuery, setCustomQuery] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [intervalMin, setIntervalMin] = useState(0);
  const [tickerItems, setTickerItems] = useState([
    "CLARITY ACT MARKUP — THURSDAY", "BTC MARKET STRUCTURE BILL ADVANCING",
    "SENATE BANKING COMMITTEE — 100+ AMENDMENTS FILED", "STABLECOIN YIELD COMPROMISE REACHED",
    "SEC/CFTC JURISDICTION SPLIT UNDER DEBATE", "DIGITAL ASSET MARKET CLARITY ACT — 309 PAGES",
    "CLARITY ACT MARKUP — THURSDAY", "BTC MARKET STRUCTURE BILL ADVANCING",
  ]);
  const intervalRef = useRef(null);
  const lastFetchRef = useRef(null);

  if (!apiKey) return <ApiKeySetup onSave={setApiKey} />;

  const getQuery = () => selectedTopic.id === "custom" ? customQuery : selectedTopic.query;

  const fetchUpdate = async () => {
    const q = getQuery();
    if (!q.trim()) return;
    setLoading(true);
    setStatus("scanning");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "interleaved-thinking-2025-05-14",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are a sharp financial market intelligence analyst. Search the web for the latest information on the given topic, then respond ONLY with a valid JSON object (no markdown, no backticks, no extra text):
{"summary":"2-3 sentence summary","sentiment":"bullish|bearish|neutral","bullets":["point1","point2","point3"],"headline":"6-8 word headline","tickers":["TICK1"],"catalyst":"key catalyst or risk sentence"}
For gems/lowcap: include real ticker symbols under $2B market cap. For macro: use specific numbers. Only return JSON.`,
          messages: [{ role: "user", content: `Search and analyze latest information on: ${q}. Focus on last 48-72 hours. Include specific names, numbers, tickers.` }],
        }),
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const newUpdate = {
        ...parsed,
        topic: selectedTopic.id === "custom" ? customQuery : selectedTopic.label,
        timestamp: Date.now(),
        id: Date.now(),
      };
      setUpdates(prev => [newUpdate, ...prev].slice(0, 20));
      lastFetchRef.current = Date.now();
      setTickerItems(prev => [parsed.headline?.toUpperCase() || "NEW UPDATE", ...prev].slice(0, 16));
      setStatus("live");
    } catch (err) {
      setStatus("error");
      setUpdates(prev => [{
        summary: `Scan failed: ${err.message}`,
        sentiment: "bearish", bullets: ["Check API key is valid", "Check internet connection"],
        headline: "SCAN ERROR", tickers: [], catalyst: "",
        topic: selectedTopic.label, timestamp: Date.now(), id: Date.now(),
      }, ...prev].slice(0, 20));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (intervalMin > 0) intervalRef.current = setInterval(fetchUpdate, intervalMin * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMin, selectedTopic, customQuery]);

  const statusColor = status === "live" ? "#00ff88" : status === "scanning" ? "#ffaa00" : status === "error" ? "#ff4444" : "#1a3a1a";
  const statusText = status === "live" ? "LIVE" : status === "scanning" ? "SCANNING" : status === "error" ? "ERROR" : "IDLE";

  return (
    <div style={{ minHeight: "100vh", background: "#010801", color: "#5a9a5a", fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #0a1a0a", background: "#010801", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#1a3a1a", marginBottom: 4 }}>MARKET INTELLIGENCE SYSTEM</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", color: "#00ff88", textShadow: "0 0 20px rgba(0,255,136,0.3)", fontFamily: "'Courier New', monospace" }}>
              SENTINEL <span style={{ color: "#1a5a1a" }}>//</span> AI
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginBottom: 4 }}>
              <PulseDot active={status === "live" || loading} />
              <span style={{ fontSize: 11, color: statusColor, letterSpacing: "0.15em" }}>{statusText}</span>
            </div>
            <div style={{ fontSize: 10, color: "#1a2a1a" }}>{lastFetchRef.current ? `LAST SCAN ${timeAgo(lastFetchRef.current)}` : "NO SCAN YET"}</div>
            <button onClick={() => { localStorage.removeItem("sentinel_key"); setApiKey(""); }} style={{ marginTop: 4, background: "none", border: "none", color: "#1a2a1a", fontSize: 9, cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.1em" }}>
              ⊠ CHANGE KEY
            </button>
          </div>
        </div>
      </div>

      <Ticker items={tickerItems} />

      <div style={{ flex: 1, padding: "20px 24px", maxWidth: 720, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Topics */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#1a3a1a", marginBottom: 8 }}>SELECT TOPIC</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TOPICS.map(t => (
              <button key={t.id} onClick={() => setSelectedTopic(t)} style={{
                padding: "6px 12px", border: "1px solid",
                borderColor: selectedTopic.id === t.id ? "#00ff88" : "#0f2a0f",
                background: selectedTopic.id === t.id ? "rgba(0,255,136,0.05)" : "transparent",
                color: selectedTopic.id === t.id ? "#00ff88" : "#2a5a2a",
                fontSize: 11, cursor: "pointer", letterSpacing: "0.05em",
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {selectedTopic.id === "custom" && (
          <div style={{ marginBottom: 16 }}>
            <input value={customQuery} onChange={e => setCustomQuery(e.target.value)}
              placeholder="e.g. NVIDIA earnings, Fed rate decision, Bitcoin ETF..."
              style={{ width: "100%", padding: "10px 14px", background: "#030a03", border: "1px solid #0f2a0f", color: "#7aaa7a", fontSize: 12, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={fetchUpdate} disabled={loading || !getQuery().trim()} style={{
            padding: "10px 20px", background: loading ? "transparent" : "rgba(0,255,136,0.08)",
            border: "1px solid", borderColor: loading ? "#0f2a0f" : "#00ff88",
            color: loading ? "#1a3a1a" : "#00ff88", fontSize: 12,
            cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.1em", fontFamily: "monospace",
          }}>
            {loading ? "◌ SCANNING..." : "▶ SCAN NOW"}
          </button>
          <select value={intervalMin} onChange={e => setIntervalMin(Number(e.target.value))} style={{
            padding: "10px 12px", background: "#030a03", border: "1px solid #0f2a0f",
            color: "#2a5a2a", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
          }}>
            {INTERVALS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
          {intervalMin > 0 && <span style={{ fontSize: 11, color: "#1a4a1a" }}>↻ AUTO {intervalMin}MIN</span>}
          {updates.length > 0 && (
            <button onClick={() => setUpdates([])} style={{ marginLeft: "auto", padding: "10px 14px", background: "transparent", border: "1px solid #0f1a0f", color: "#1a3a1a", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>
              CLEAR
            </button>
          )}
        </div>

        {updates.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed #0a1a0a" }}>
            <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>◈</div>
            <div style={{ fontSize: 12, color: "#1a3a1a", letterSpacing: "0.15em" }}>SELECT A TOPIC AND HIT SCAN NOW</div>
            <div style={{ fontSize: 11, color: "#0f2a0f", marginTop: 8 }}>AI will search the web for latest market intelligence</div>
          </div>
        )}

        {loading && updates.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 12, color: "#00ff88", letterSpacing: "0.2em" }}>◌ SCANNING MARKETS...</div>
          </div>
        )}

        <div>{updates.map((u, i) => <UpdateCard key={u.id} update={u} index={i} />)}</div>
      </div>

      <div style={{ borderTop: "1px solid #0a1a0a", padding: "12px 24px", fontSize: 10, color: "#0f2a0f", letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
        <span>SENTINEL AI // POWERED BY CLAUDE + WEB SEARCH</span>
        <span>{updates.length} UPDATES LOGGED</span>
      </div>
    </div>
  );
}
