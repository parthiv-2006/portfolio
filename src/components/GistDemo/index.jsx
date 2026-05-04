import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GistPopup } from './GistPopup';
import { GistCaptureOverlay } from './GistCaptureOverlay';
import './gist-tokens.css';

const BACKEND = 'https://gist-vc8m.onrender.com';

/* ── Sample article shown inside the fake browser ── */
const ARTICLE = {
  url: 'research.ai/personal-knowledge-graphs',
  title: 'The Rise of Personal Knowledge Graphs',
  paragraphs: [
    `In an era of information overload, the way we consume and retain knowledge has become increasingly fragmented. Research suggests that the average knowledge worker encounters over 200 pieces of new information daily, yet retains fewer than 10% of it after 24 hours — a phenomenon cognitive scientists call the "forgetting curve."`,
    `Personal knowledge management (PKM) tools have emerged to address this challenge. Unlike traditional note-taking apps that organize by folder or tag, newer approaches use semantic embeddings to cluster related ideas automatically — revealing connections that would otherwise remain hidden across your saved content.`,
    `The key insight driving these tools is that knowledge doesn't exist in isolation. A concept about transformer architectures might connect to an article on cognitive psychology, which in turn links to a paper on habit formation. By mapping these relationships visually, users can develop a richer understanding of how ideas intersect across domains.`,
    `Vector databases have made this possible at consumer scale. By encoding text as high-dimensional embeddings, similarity search can surface related memories in milliseconds — even across thousands of saved items. The result is a system that doesn't just store information, but actively surfaces connections you didn't know existed.`,
    `Early adopters report that the act of building a personal knowledge graph changes how they read. Rather than passively consuming content, they begin curating with intent — selecting passages that genuinely advance their understanding and watching the semantic clusters in their library grow more coherent over time.`,
  ],
};

/* ── Puzzle-piece icon (Chrome Extensions) ── */
function IconPuzzle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7H2V20a2 2 0 0 0 2 2h3.8v-1.5c0-1.5 1.2-2.7 2.7-2.7 1.5 0 2.7 1.2 2.7 2.7V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
    </svg>
  );
}

/* ── Traffic-light dots ── */
function TrafficLights() {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, flexShrink: 0 }} />
      ))}
    </div>
  );
}

/* ── "Gist it!" floating button ── */
function GistItButton({ position, loading, onClick }) {
  if (!position) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 60,
        transform: 'translateX(-50%)',
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 12px',
          background: 'oklch(0.16 0.004 120)',
          border: '1px solid oklch(0.75 0.11 150 / 0.5)',
          borderRadius: '20px',
          color: 'oklch(0.75 0.11 150)',
          fontSize: '11.5px', fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: '0 4px 20px oklch(0 0 0 / 0.5)',
          transition: 'all 150ms ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = 'oklch(0.75 0.11 150 / 0.15)';
            e.currentTarget.style.borderColor = 'oklch(0.75 0.11 150 / 0.8)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'oklch(0.16 0.004 120)';
          e.currentTarget.style.borderColor = 'oklch(0.75 0.11 150 / 0.5)';
        }}
      >
        {loading ? (
          <>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              border: '1.5px solid oklch(0.75 0.11 150 / 0.3)',
              borderTopColor: 'oklch(0.75 0.11 150)',
              animation: 'gistBtnSpin 0.7s linear infinite',
            }} />
            Gisting…
          </>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Gist it!
          </>
        )}
      </button>
      <style>{`@keyframes gistBtnSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── Main GistDemoWrapper ── */
export default function GistDemoWrapper() {
  const [popupOpen, setPopupOpen]       = useState(false);
  const [captureMode, setCaptureMode]   = useState(false);
  const [captureResult, setCaptureResult] = useState(null);
  const [capturing, setCapturing]       = useState(false);

  /* "Gist it!" button state */
  const [gistBtnPos, setGistBtnPos]     = useState(null);
  const [selectedText, setSelectedText] = useState('');

  const articleRef  = useRef(null);
  const viewportRef = useRef(null);

  /* Track text selection inside the article */
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? '';

      if (!text || !articleRef.current) {
        setGistBtnPos(null);
        setSelectedText('');
        return;
      }

      /* Only show button if selection is inside the article */
      try {
        const range = sel.getRangeAt(0);
        const articleNode = articleRef.current;
        if (!articleNode.contains(range.commonAncestorContainer)) {
          setGistBtnPos(null);
          setSelectedText('');
          return;
        }
        const rect = range.getBoundingClientRect();
        setGistBtnPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        setSelectedText(text);
      } catch {
        setGistBtnPos(null);
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  /* Send selected text to backend */
  const handleGistIt = useCallback(async () => {
    if (!selectedText || capturing) return;
    setCapturing(true);
    setGistBtnPos(null);

    try {
      const apiKey = localStorage.getItem('gist_demo_api_key') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-Gemini-Api-Key'] = apiKey;

      const res = await fetch(`${BACKEND}/gist`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_text: selectedText,
          url: `https://${ARTICLE.url}`,
          mode: 'explain',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);

      setCaptureResult(data);
      setPopupOpen(true);
      /* Clear browser selection */
      window.getSelection()?.removeAllRanges();
    } catch (err) {
      setCaptureResult({ error: err.message });
      setPopupOpen(true);
    } finally {
      setCapturing(false);
    }
  }, [selectedText, capturing]);

  /* Visual capture: area selected → use text from article as selected_text */
  const handleCaptureArea = useCallback(async (rect) => {
    setCaptureMode(false);
    setCapturing(true);

    try {
      /* Find article text that overlaps with the selection rect */
      const paraEls = articleRef.current?.querySelectorAll('p') ?? [];
      let capturedText = '';
      for (const el of paraEls) {
        const elRect = el.getBoundingClientRect();
        /* Simple overlap check */
        if (
          elRect.bottom > rect.y &&
          elRect.top < rect.y + rect.height &&
          elRect.right > rect.x &&
          elRect.left < rect.x + rect.width
        ) {
          capturedText += (capturedText ? ' ' : '') + el.textContent;
        }
      }
      if (!capturedText) capturedText = ARTICLE.paragraphs[0];

      const apiKey = localStorage.getItem('gist_demo_api_key') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-Gemini-Api-Key'] = apiKey;

      const res = await fetch(`${BACKEND}/gist`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_text: capturedText,
          url: `https://${ARTICLE.url}`,
          mode: 'summarize',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);

      setCaptureResult(data);
      setPopupOpen(true);
    } catch (err) {
      setCaptureResult({ error: err.message });
      setPopupOpen(true);
    } finally {
      setCapturing(false);
    }
  }, []);

  const handleCaptureStart = useCallback(() => {
    setCaptureMode(true);
    setPopupOpen(false);
  }, []);

  return (
    <div className="gist-scope" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ── Browser window chrome ── */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#1e1e1e',
        boxShadow: '0 32px 80px oklch(0 0 0 / 0.6)',
        border: '1px solid oklch(1 0 0 / 0.08)',
      }}>

        {/* Title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 14px',
          height: '42px',
          background: '#2a2a2a',
          borderBottom: '1px solid oklch(1 0 0 / 0.07)',
          flexShrink: 0,
        }}>
          <TrafficLights />

          {/* URL bar */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: '#1a1a1a',
            border: '1px solid oklch(1 0 0 / 0.1)',
            borderRadius: '6px',
            padding: '5px 10px',
            height: '26px',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            {/* Lock icon */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.04 150)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: '11.5px', color: 'oklch(0.65 0.01 95)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em', flex: 1 }}>
              {ARTICLE.url}
            </span>
          </div>

          {/* Extensions area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            {/* Puzzle-piece (extensions icon) */}
            <button
              onClick={() => setPopupOpen((v) => !v)}
              title="Gist Extension"
              style={{
                width: '28px', height: '28px',
                borderRadius: '6px',
                background: popupOpen ? 'oklch(0.75 0.11 150 / 0.15)' : 'transparent',
                border: `1px solid ${popupOpen ? 'oklch(0.75 0.11 150 / 0.4)' : 'transparent'}`,
                color: popupOpen ? 'oklch(0.75 0.11 150)' : 'oklch(0.55 0 0)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!popupOpen) {
                  e.currentTarget.style.background = 'oklch(1 0 0 / 0.07)';
                  e.currentTarget.style.color = 'oklch(0.75 0 0)';
                }
              }}
              onMouseLeave={(e) => {
                if (!popupOpen) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'oklch(0.55 0 0)';
                }
              }}
            >
              <IconPuzzle />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div
          ref={viewportRef}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          {/* Article — scrollable webpage content */}
          <div
            ref={articleRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '40px 48px',
              background: '#f8f6f1',
              color: '#1a1a18',
              fontFamily: '"Inter", Georgia, serif',
              scrollbarWidth: 'thin',
              scrollbarColor: '#c8c4b8 transparent',
            }}
          >
            {/* Instruction banner */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: 'oklch(0.75 0.11 150 / 0.1)',
              border: '1px solid oklch(0.75 0.11 150 / 0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '28px',
              fontSize: '12px', color: 'oklch(0.35 0.07 150)',
              fontFamily: '"Inter", sans-serif', lineHeight: 1.5,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                <strong>Interactive demo:</strong> Select any text below, then click <strong>"Gist it!"</strong> to capture it with AI. Click the puzzle-piece icon <strong>⊞</strong> in the toolbar to open the extension.
              </span>
            </div>

            {/* Article content */}
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7a72', marginBottom: '8px', fontFamily: '"Inter", sans-serif' }}>
              Research · AI & Knowledge Management
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111110', marginBottom: '16px', lineHeight: 1.25, fontFamily: '"Inter", sans-serif' }}>
              {ARTICLE.title}
            </h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px', color: '#8a8a82', fontSize: '12px', fontFamily: '"Inter", sans-serif' }}>
              <span>Research Digest</span>
              <span>·</span>
              <span>May 2026</span>
              <span>·</span>
              <span>5 min read</span>
            </div>

            {ARTICLE.paragraphs.map((para, i) => (
              <p key={i} style={{
                fontSize: '15px', lineHeight: 1.75, color: '#2a2a28',
                marginBottom: '20px', margin: '0 0 20px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                cursor: 'text',
              }}>
                {para}
              </p>
            ))}

            <div style={{ height: '40px' }} />
          </div>

          {/* Capture overlay — sits above the article */}
          {captureMode && (
            <GistCaptureOverlay
              onCapture={handleCaptureArea}
              onCancel={() => setCaptureMode(false)}
            />
          )}

          {/* Popup — floating top-right, attached to puzzle icon */}
          {popupOpen && !captureMode && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 50,
                animation: 'gistPopupIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
              }}
            >
              <style>{`
                @keyframes gistPopupIn {
                  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>
              <GistPopup
                onCaptureStart={handleCaptureStart}
                captureResult={captureResult?.error ? null : captureResult}
                onDismissResult={() => setCaptureResult(null)}
              />
            </div>
          )}

          {/* Loading overlay while capturing */}
          {capturing && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 45,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'oklch(0 0 0 / 0.15)',
              backdropFilter: 'blur(2px)',
            }}>
              <div style={{
                background: 'oklch(0.16 0.004 120 / 0.95)',
                border: '1px solid oklch(0.75 0.11 150 / 0.3)',
                borderRadius: '12px',
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 12px 40px oklch(0 0 0 / 0.5)',
              }}>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid oklch(0.75 0.11 150 / 0.25)',
                  borderTopColor: 'oklch(0.75 0.11 150)',
                  borderRadius: '50%',
                  animation: 'gistBtnSpin 0.7s linear infinite',
                }} />
                <span style={{ fontSize: '13px', color: 'oklch(0.78 0.006 95)', fontFamily: '"Inter", sans-serif' }}>
                  Gisting with AI…
                </span>
                <style>{`@keyframes gistBtnSpin{to{transform:rotate(360deg)}}`}</style>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* "Gist it!" floating button — portal-like, positioned via fixed coords */}
      <GistItButton
        position={gistBtnPos}
        loading={capturing}
        onClick={handleGistIt}
      />
    </div>
  );
}
