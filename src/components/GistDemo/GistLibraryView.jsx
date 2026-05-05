import React, { useEffect, useRef, useState } from 'react';
import { GistCard } from './GistCard';

const BACKEND = 'https://gist-vc8m.onrender.com';

const T = {
  bg: 'var(--bg)', bgElevated: 'var(--surface)', bgHover: 'var(--surface-2)',
  bgActive: 'var(--surface-3)', border: 'var(--hairline)', borderMid: 'var(--hairline-2)',
  text: 'var(--ink)', textSub: 'var(--ink-2)', textMuted: 'var(--ink-3)', textDim: 'var(--ink-4)',
  accent: 'var(--accent)', accentBg: 'var(--accent-bg)', accentInk: 'var(--accent-ink)',
  accentBorder: 'var(--accent-border)', accentGlow: 'var(--accent-glow)',
};
const FONT = '"Inter", -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

function IconSearch() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function IconEmptyLibrary() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function GistLibraryView({ initialTag = null, onTagConsumed } = {}) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [retryCount, setRetry]  = useState(0);

  const [query, setQuery]         = useState('');
  const [askState, setAskState]   = useState('idle');
  const [askResult, setAskResult] = useState(null);
  const [askError, setAskError]   = useState(null);
  const [srcExpanded, setSrcExp]  = useState(null);

  const initialSearchDone = useRef(false);

  // Auto-search when navigated here via a tag click from HomeView
  useEffect(() => {
    if (!initialTag || initialSearchDone.current) return;
    initialSearchDone.current = true;
    onTagConsumed?.();
    setQuery(initialTag);
    setAskState('searching');
    setAskResult(null); setAskError(null); setSrcExp(null);
    fetch(`${BACKEND}/library/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: initialTag }),
    })
      .then((r) => r.ok ? r.json() : r.json().then((b) => Promise.reject(new Error(b.error ?? `Search failed (${r.status}).`))))
      .then((data) => { setAskResult(data); setAskState('done'); })
      .catch((e) => { setAskError(e.message); setAskState('error'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTag]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${BACKEND}/library`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error ?? `Failed to load library (${r.status}).`);
        }
        return r.json();
      })
      .then((data) => { if (!cancelled) { setItems(data.items ?? []); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [retryCount]);

  const handleAsk = async () => {
    const q = query.trim();
    if (!q || askState === 'searching') return;
    setAskState('searching');
    setAskResult(null);
    setAskError(null);
    setSrcExp(null);
    try {
      const r = await fetch(`${BACKEND}/library/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error ?? `Search failed (${r.status}).`);
      }
      const data = await r.json();
      setAskResult(data);
      setAskState('done');
    } catch (e) {
      setAskError(e.message);
      setAskState('error');
    }
  };

  const handleClearAsk = () => {
    setQuery(''); setAskState('idle'); setAskResult(null); setAskError(null);
  };

  const isSearching = askState === 'searching';

  const searchBar = (
    <div style={{ padding: '10px 12px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        background: T.bgElevated,
        border: `1px solid ${isSearching ? T.accentBorder : T.border}`,
        borderRadius: '8px', padding: '7px 9px',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        boxShadow: isSearching ? `0 0 0 3px ${T.accentGlow}` : 'none',
      }}>
        <span style={{ color: isSearching ? T.accent : T.textDim, display: 'flex', flexShrink: 0, transition: 'color 200ms ease' }}>
          <IconSearch />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
          placeholder="Ask your library…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '12px', color: T.text, fontFamily: FONT, padding: 0 }}
        />
        {isSearching && (
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.accent, flexShrink: 0, animation: 'gistPulse 1s ease-in-out infinite' }} />
        )}
        {(askState === 'done' || askState === 'error') && (
          <button onClick={handleClearAsk} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 0, display: 'flex' }}>
            <IconX />
          </button>
        )}
        {askState === 'idle' && query.trim() && (
          <button onClick={handleAsk} style={{
            background: T.accent, border: 'none', borderRadius: '4px',
            color: T.accentInk, fontSize: '9px', fontWeight: 700, fontFamily: MONO,
            padding: '3px 7px', cursor: 'pointer', flexShrink: 0,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>ASK</button>
        )}
      </div>
      <style>{`@keyframes gistPulse{0%,100%{opacity:1}50%{opacity:0.25}}`}</style>
    </div>
  );

  if (askState === 'done' && askResult) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {searchBar}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '9px 12px' }}>
          <div style={{ background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
              <span style={{ color: T.accent, display: 'flex' }}><IconSparkle /></span>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: T.accent, fontFamily: MONO }}>Answer</span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: T.text, lineHeight: 1.65 }}>{askResult.answer}</p>
          </div>
          {askResult.sources.length > 0 && (
            <div>
              <p style={{ margin: '0 0 5px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textDim, fontFamily: MONO }}>
                Sources · {askResult.sources.length}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {askResult.sources.map((src, i) => (
                  <GistCard key={i} item={src} expanded={srcExpanded === i} onToggle={() => setSrcExp(srcExpanded === i ? null : i)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (askState === 'error') {
    return (
      <div>
        {searchBar}
        <div style={{ padding: '9px 12px' }}>
          <div style={{
            background: 'oklch(0.25 0.05 25 / 0.15)', border: '1px solid oklch(0.50 0.12 25 / 0.3)',
            borderLeft: '2px solid oklch(0.65 0.15 25)', borderRadius: '7px',
            padding: '9px 11px', fontSize: '12px', color: 'oklch(0.72 0.15 25)', lineHeight: 1.5,
          }}>
            {askError ?? 'Search failed.'}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        {searchBar}
        <div style={{ padding: '36px 14px', textAlign: 'center', color: T.textDim, fontSize: '12px', fontFamily: MONO }}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {searchBar}
        <div style={{ padding: '9px 12px' }}>
          <div style={{
            background: 'oklch(0.25 0.05 25 / 0.15)', border: '1px solid oklch(0.50 0.12 25 / 0.3)',
            borderLeft: '2px solid oklch(0.65 0.15 25)', borderRadius: '7px',
            padding: '10px 12px', fontSize: '12px', color: 'oklch(0.72 0.15 25)', lineHeight: 1.5,
          }}>
            <div style={{ marginBottom: '8px' }}>{error}</div>
            <button
              onClick={() => setRetry((n) => n + 1)}
              style={{ background: 'none', border: '1px solid oklch(0.50 0.12 25 / 0.4)', borderRadius: '5px', color: 'oklch(0.72 0.15 25)', fontSize: '11px', padding: '3px 9px', cursor: 'pointer', fontFamily: FONT }}
            >Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        {searchBar}
        <div style={{ padding: '32px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: T.textDim, opacity: 0.45, display: 'flex' }}><IconEmptyLibrary /></span>
          <div style={{ fontSize: '12px', color: T.textDim, lineHeight: 1.7 }}>
            Your library is empty.
            <br /><span style={{ color: T.textMuted }}>Select text in the article and click "Gist it!" to save your first gist.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {searchBar}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '9px 12px' }}>
        {items.map((item, i) => (
          <GistCard key={item.id ?? i} item={item} expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} />
        ))}
      </div>
    </div>
  );
}
