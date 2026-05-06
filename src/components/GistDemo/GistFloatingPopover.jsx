import React, { useState, useRef, useEffect, useCallback } from 'react';

// ── Design tokens — CSS vars so light/dark theme works automatically ──────────
const FONT = '"Inter", -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const BG          = 'var(--bg)';
const BG_ELEVATED = 'var(--surface)';
const BG_INPUT    = 'var(--surface-2)';
const INK         = 'var(--ink)';
const INK2        = 'var(--ink-2)';
const INK3        = 'var(--ink-3)';
const HAIRLINE    = 'var(--hairline)';
const HAIRLINE2   = 'var(--hairline-2)';

const DEFAULT_W = 340;
const DEFAULT_H = 400;
const MARGIN    = 12;

const MODE_COLORS = {
  standard: '#10b981',
  simple:   '#60a5fa',
  legal:    '#f59e0b',
  academic: '#a78bfa',
};
const MODES = [
  { value: 'standard', label: 'Standard' },
  { value: 'simple',   label: 'ELI5'     },
  { value: 'legal',    label: 'Legal'    },
  { value: 'academic', label: 'Academic' },
];

// ── Error classifier ─────────────────────────────────────────────────────────
function getErrorMeta(error, code) {
  const MAP = {
    API_KEY_INVALID:       { title: 'Invalid API Key',     hint: 'Open Settings → API Configuration to update your key.' },
    API_KEY_MISSING:       { title: 'API Key Required',    hint: 'Add your Gemini key in Settings → API Configuration.' },
    QUOTA_EXCEEDED:        { title: 'Quota Exceeded',      hint: 'Your free Gemini quota is full. Visit aistudio.google.com.' },
    API_PERMISSION_DENIED: { title: 'Permission Denied',   hint: "Your key lacks access. Check Google AI Studio." },
    RATE_LIMITED:          { title: 'Too Many Requests',   hint: 'Wait a moment and try again.' },
    LLM_TIMEOUT:           { title: 'Request Timed Out',   hint: 'Try selecting a shorter passage.' },
    LLM_UNAVAILABLE:       { title: 'Service Unavailable', hint: 'Gemini may be warming up — try again shortly.' },
    LLM_ERROR:             { title: 'AI Error',            hint: 'Try again or select different text.' },
    NETWORK_ERROR:         { title: 'No Connection',       hint: 'Check your internet connection, or the AI backend may still be waking up — try again in a moment.' },
    CORS_ERROR:            { title: 'Domain Not Allowed',  hint: 'The backend is blocking requests from this domain. Add this origin to the backend CORS allowlist.' },
    TEXT_TOO_LONG:         { title: 'Text Too Long',       hint: 'Max 2,000 characters. Select a shorter passage.' },
    EMPTY_TEXT:            { title: 'Nothing Selected',    hint: 'Highlight some text on the page first.' },
  };
  if (code && MAP[code]) return MAP[code];
  const m = (error ?? '').toLowerCase();
  if (m.includes('api key') || m.includes('invalid key') || m.includes('unauthenticated')) return MAP.API_KEY_INVALID;
  if (m.includes('quota') || m.includes('exhausted'))         return MAP.QUOTA_EXCEEDED;
  if (m.includes('too many') || m.includes('rate limit'))     return MAP.RATE_LIMITED;
  if (m.includes('too long') || m.includes('2,000'))          return MAP.TEXT_TOO_LONG;
  if (m.includes('failed to fetch') || m.includes('network') || m.includes('offline')) return MAP.NETWORK_ERROR;
  if (m.includes('cors') || m.includes('blocked') || m.includes('not allowed')) return MAP.CORS_ERROR;
  if (m.includes('unavailable') || m.includes('starting up')) return MAP.LLM_UNAVAILABLE;
  if (m.includes('timed out') || m.includes('timeout'))       return MAP.LLM_TIMEOUT;
  return { title: 'Something Went Wrong', hint: 'Try selecting different text or try again.' };
}

// ── Lightweight markdown renderer (bold / italic / inline-code / line-breaks) ─
function MdText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        // Bullet list
        if (/^\s*[-*]\s/.test(line)) {
          return (
            <div key={li} style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
              <span style={{ color: MODE_COLORS.standard, flexShrink: 0 }}>•</span>
              <span><InlineMarkdown text={line.replace(/^\s*[-*]\s/, '')} /></span>
            </div>
          );
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={li} style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
              <span style={{ color: INK3, flexShrink: 0, minWidth: '14px' }}>{match[1]}.</span>
              <span><InlineMarkdown text={match[2]} /></span>
            </div>
          );
        }
        // Heading H3
        if (line.startsWith('### ')) {
          return <div key={li} style={{ fontWeight: 700, fontSize: '12.5px', color: INK, marginBottom: '4px', marginTop: li > 0 ? '8px' : 0 }}><InlineMarkdown text={line.slice(4)} /></div>;
        }
        // Heading H2
        if (line.startsWith('## ')) {
          return <div key={li} style={{ fontWeight: 700, fontSize: '13px', color: INK, marginBottom: '4px', marginTop: li > 0 ? '8px' : 0 }}><InlineMarkdown text={line.slice(3)} /></div>;
        }
        // Empty → spacer
        if (!line.trim()) return <div key={li} style={{ height: '6px' }} />;
        return <div key={li} style={{ marginBottom: '3px' }}><InlineMarkdown text={line} /></div>;
      })}
    </>
  );
}

function InlineMarkdown({ text }) {
  // Split on **bold**, *italic*, `code`
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch   = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch   = remaining.match(/`(.+?)`/);
    const matches = [
      boldMatch   && { idx: boldMatch.index,   len: boldMatch[0].length,   content: boldMatch[1],   type: 'bold'   },
      italicMatch && { idx: italicMatch.index, len: italicMatch[0].length, content: italicMatch[1], type: 'italic' },
      codeMatch   && { idx: codeMatch.index,   len: codeMatch[0].length,   content: codeMatch[1],   type: 'code'   },
    ].filter(Boolean).sort((a, b) => a.idx - b.idx);

    if (matches.length === 0) { parts.push(<span key={key++}>{remaining}</span>); break; }
    const first = matches[0];
    if (first.idx > 0) parts.push(<span key={key++}>{remaining.slice(0, first.idx)}</span>);
    if (first.type === 'bold')   parts.push(<strong key={key++} style={{ fontWeight: 600, color: INK }}>{first.content}</strong>);
    if (first.type === 'italic') parts.push(<em key={key++} style={{ fontStyle: 'italic' }}>{first.content}</em>);
    if (first.type === 'code')   parts.push(<code key={key++} style={{ fontFamily: MONO, fontSize: '0.88em', background: 'oklch(1 0 0 / 0.07)', padding: '1px 5px', borderRadius: '3px', color: MODE_COLORS.standard }}>{first.content}</code>);
    remaining = remaining.slice(first.idx + first.len);
  }
  return <>{parts}</>;
}

// ── Small icon buttons ────────────────────────────────────────────────────────
function Btn({ onClick, title, disabled = false, active = false, children, danger = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 26, height: 26, borderRadius: 6, padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: active ? '1px solid oklch(0.75 0.11 150 / 0.35)' : '1px solid transparent',
        background: active ? 'oklch(0.75 0.11 150 / 0.15)' : hov && !disabled ? 'oklch(1 0 0 / 0.07)' : 'transparent',
        color: danger && hov ? 'oklch(0.72 0.15 25)' : active ? 'oklch(0.75 0.11 150)' : hov && !disabled ? INK2 : INK3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 120ms ease',
        flexShrink: 0,
      }}
    >{children}</button>
  );
}

function PillBtn({ onClick, disabled, label, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
        fontFamily: FONT, cursor: disabled ? 'not-allowed' : 'pointer',
        border: accent ? '1px solid oklch(0.75 0.11 150 / 0.3)' : `1px solid ${hov ? HAIRLINE2 : HAIRLINE}`,
        background: accent ? 'oklch(0.75 0.11 150 / 0.12)' : hov ? 'oklch(1 0 0 / 0.06)' : 'oklch(1 0 0 / 0.03)',
        color: accent ? 'oklch(0.75 0.11 150)' : hov ? INK2 : INK3,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 120ms ease', whiteSpace: 'nowrap',
      }}
    >{label}</button>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IcoVolume  = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
const IcoPause   = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IcoStop    = () => <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>;
const IcoSidebar = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M15 3v18"/></svg>;
const IcoMinus   = () => <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoX       = () => <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoSend    = () => <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoGist    = () => (
  <svg width={16} height={16} viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)"/>
    <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7" stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)"/>
    <path d="M 14 8.5 Q 14.5 13.5 14 18.5" stroke="oklch(0.20 0.04 150)" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export function GistFloatingPopover({
  state = 'IDLE',      // 'IDLE' | 'LOADING' | 'STREAMING' | 'DONE' | 'ERROR'
  messages = [],       // { role: 'user'|'model', content: string }[]
  streamingText = '',
  error,
  errorCode,
  anchorRect,          // { x, y, width, height } — relative to the viewport container
  mode = 'standard',
  isSidebarMode = false,
  saveStatus = 'unsaved',
  onClose,
  onModeChange,
  onSendMessage,
  onSaveGist,
  onToggleSidebar,
}) {
  const [input,     setInput]     = useState('');
  const [minimized, setMinimized] = useState(false);
  const [ttsState,  setTtsState]  = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [isDragging, setIsDragging] = useState(false);

  // Position & size (floating mode only)
  const [pos,  setPos]  = useState(() => calcInitPos(anchorRect));
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const posRef  = useRef(pos);  posRef.current  = pos;
  const sizeRef = useRef(size); sizeRef.current = size;

  const historyRef = useRef(null);

  const isInputDisabled = state === 'LOADING' || state === 'STREAMING'
    || (state === 'IDLE' && messages.length === 0);

  const accentColor = MODE_COLORS[mode] || MODE_COLORS.standard;

  // Re-anchor on new selection
  useEffect(() => {
    if (anchorRect && !isSidebarMode) {
      setPos(calcInitPos(anchorRect));
      setMinimized(false);
    }
  }, [anchorRect, isSidebarMode]);

  // Auto-scroll chat on new content
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, streamingText, state]);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Drag ────────────────────────────────────────────────────────────────────
  const onHeaderMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.button !== 0 || isSidebarMode) return;
    e.preventDefault();
    const ox = e.clientX - posRef.current.x;
    const oy = e.clientY - posRef.current.y;
    setIsDragging(true);
    const onMove = (ev) => {
      const w = sizeRef.current.w;
      setPos({
        x: Math.max(MARGIN, Math.min(window.innerWidth  - w - MARGIN, ev.clientX - ox)),
        y: Math.max(MARGIN, Math.min(window.innerHeight - 44,          ev.clientY - oy)),
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setIsDragging(false);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [isSidebarMode]);

  // ── Resize ──────────────────────────────────────────────────────────────────
  const onResizeMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const sw = sizeRef.current.w, sh = sizeRef.current.h;
    const onMove = (ev) => setSize({
      w: Math.max(280, Math.min(640, sw + ev.clientX - sx)),
      h: Math.max(240, Math.min(760, sh + ev.clientY - sy)),
    });
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, []);

  // ── TTS ─────────────────────────────────────────────────────────────────────
  const handleTTS = useCallback(() => {
    const lastModel = [...messages].reverse().find(m => m.role === 'model');
    const txt = lastModel?.content || streamingText;
    if (!txt) return;
    if (ttsState === 'playing')  { window.speechSynthesis.pause();  return; }
    if (ttsState === 'paused')   { window.speechSynthesis.resume(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(txt);
    utt.rate = 1.0;
    utt.onstart   = () => setTtsState('playing');
    utt.onend     = () => setTtsState('idle');
    utt.onerror   = () => setTtsState('idle');
    utt.onpause   = () => setTtsState('paused');
    utt.onresume  = () => setTtsState('playing');
    window.speechSynthesis.speak(utt);
  }, [messages, streamingText, ttsState]);

  const handleSend = () => {
    if (!input.trim() || !onSendMessage) return;
    onSendMessage(input.trim());
    setInput('');
  };

  // ── Minimized dot ────────────────────────────────────────────────────────────
  if (minimized) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${pos.x}px`, top: `${pos.y}px`,
          width: 38, height: 38, borderRadius: '50%',
          background: BG_ELEVATED,
          border: '2px solid oklch(0.75 0.11 150 / 0.55)',
          boxShadow: '0 6px 24px oklch(0 0 0 / 0.55), 0 0 0 4px oklch(0.75 0.11 150 / 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 62,
          animation: 'gistPopIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
        onClick={() => setMinimized(false)}
        title="Restore Gist"
      >
        <IcoGist />
      </div>
    );
  }

  // ── Popover shell ─────────────────────────────────────────────────────────────
  const shellStyle = isSidebarMode
    ? {
        position: 'absolute', top: 0, right: 0,
        width: 360, height: '100%',
        borderRadius: 0,
        borderLeft: `1px solid ${HAIRLINE}`,
      }
    : {
        position: 'absolute',
        left: pos.x, top: pos.y,
        width: size.w, height: size.h,
        borderRadius: 12,
        border: `1px solid ${HAIRLINE}`,
      };

  return (
    <>
      <style>{`
        @keyframes gistPopIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gistBlink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes gistSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .gist-fp-input:focus { outline: none; border-color: oklch(0.75 0.11 150 / 0.4) !important; box-shadow: 0 0 0 2px oklch(0.75 0.11 150 / 0.1); }
        /* Override the global cursor:none !important from index.css */
        .gist-fp-scope, .gist-fp-scope * { cursor: default !important; }
        .gist-fp-scope button   { cursor: pointer !important; }
        .gist-fp-scope input,
        .gist-fp-scope textarea { cursor: text !important; }
        .gist-fp-scope [data-grab]  { cursor: grab !important; }
        .gist-fp-scope [data-grabbing] { cursor: grabbing !important; }
        .gist-fp-scope [data-resize] { cursor: se-resize !important; }
      `}</style>

      <div
        className="gist-fp-scope"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...shellStyle,
          fontFamily: FONT, background: BG, color: INK,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px oklch(0 0 0 / 0.65), 0 0 0 1px oklch(1 0 0 / 0.06)',
          zIndex: 62,
          animation: !isSidebarMode ? 'gistPopIn 200ms cubic-bezier(0.22, 1, 0.36, 1) both' : undefined,
        }}
      >
        {/* ── Header / drag handle ── */}
        <div
          onMouseDown={onHeaderMouseDown}
          {...(!isSidebarMode ? { [isDragging ? 'data-grabbing' : 'data-grab']: '' } : {})}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 10px', flexShrink: 0,
            borderBottom: `1px solid ${HAIRLINE}`,
            background: BG_ELEVATED,
          }}
        >
          {/* Brand + mode label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <IcoGist />
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: MONO, letterSpacing: '-0.1px', color: INK }}>gist</span>
            <div style={{ width: 1, height: 14, background: HAIRLINE }} />
            <span style={{ fontSize: 10.5, fontWeight: 600, fontFamily: MONO, color: accentColor }}>
              {MODES.find(m => m.value === mode)?.label ?? 'Standard'}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {ttsState !== 'idle' && (
              <Btn onClick={() => { window.speechSynthesis.cancel(); setTtsState('idle'); }} title="Stop TTS">
                <IcoStop />
              </Btn>
            )}
            <Btn
              onClick={handleTTS}
              title={ttsState === 'playing' ? 'Pause' : 'Listen'}
              disabled={messages.length === 0 && !streamingText}
            >
              {ttsState === 'playing' ? <IcoPause /> : <IcoVolume />}
            </Btn>
            <div style={{ width: 1, height: 14, background: HAIRLINE, margin: '0 3px' }} />
            <Btn onClick={onToggleSidebar} title={isSidebarMode ? 'Float' : 'Sidebar mode'} active={isSidebarMode}>
              <IcoSidebar />
            </Btn>
            {!isSidebarMode && (
              <Btn onClick={() => setMinimized(true)} title="Minimize">
                <IcoMinus />
              </Btn>
            )}
            <Btn onClick={onClose} title="Close (Esc)">
              <IcoX />
            </Btn>
          </div>
        </div>

        {/* ── Mode selector ── */}
        <div style={{
          display: 'flex', gap: 4, padding: '7px 10px',
          borderBottom: `1px solid ${HAIRLINE}`,
          flexShrink: 0,
        }}>
          {MODES.map(({ value, label }) => {
            const active = mode === value;
            const col = MODE_COLORS[value];
            return (
              <button
                key={value}
                onClick={() => onModeChange?.(value)}
                disabled={state === 'LOADING' || state === 'STREAMING'}
                style={{
                  padding: '3px 8px', borderRadius: 5, fontSize: 10.5, fontWeight: 600,
                  fontFamily: FONT, cursor: 'pointer', border: 'none',
                  background: active ? `${col}18` : 'var(--surface-2)',
                  color: active ? col : INK3,
                  outline: active ? `1px solid ${col}30` : '1px solid oklch(1 0 0 / 0.07)',
                  transition: 'all 120ms ease',
                  opacity: (state === 'LOADING' || state === 'STREAMING') ? 0.5 : 1,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Chat history ── */}
        <div
          ref={historyRef}
          style={{
            flex: 1, overflowY: 'auto', minHeight: 0,
            padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 8,
            scrollbarWidth: 'thin', scrollbarColor: 'var(--surface-3) transparent',
          }}
        >
          {/* Empty / idle state */}
          {messages.length === 0 && state === 'IDLE' && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 10, color: INK3, textAlign: 'center', padding: '24px 16px',
            }}>
              <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <line x1="7" y1="8"  x2="17" y2="8" />
                <line x1="7" y1="12" x2="14" y2="12"/>
                <line x1="7" y1="16" x2="16" y2="16"/>
              </svg>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: INK3, marginBottom: 4 }}>
                  {isSidebarMode ? 'Gist Sidebar' : 'Ready to Gist'}
                </div>
                <div style={{ fontSize: 11, color: 'oklch(0.40 0 0)', lineHeight: 1.55 }}>
                  Highlight any text on this page for an instant AI-powered explanation.
                </div>
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, idx) => {
            const isLastModel = msg.role === 'model' && idx === messages.length - 1 && state === 'DONE';
            return (
              <div key={idx}>
                {msg.role === 'user' ? (
                  /* User bubble */
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      background: 'var(--accent-bg)', maxWidth: '88%',
                      border: '1px solid var(--accent-border)',
                      borderRadius: '10px 10px 3px 10px',
                      padding: '7px 11px', fontSize: 12, color: 'oklch(0.84 0.006 95)',
                      lineHeight: 1.55, wordBreak: 'break-word', userSelect: 'text', cursor: 'text',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* Model bubble */
                  <div>
                    <div style={{
                      fontSize: 12.5, color: INK2, lineHeight: 1.7,
                      userSelect: 'text', cursor: 'text',
                    }}>
                      <MdText text={msg.content} />
                    </div>

                    {/* Action row on last model message when done */}
                    {isLastModel && (
                      <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                        {onSaveGist && (
                          <PillBtn
                            onClick={() => (saveStatus === 'unsaved' || saveStatus === 'error') && onSaveGist(msg.content)}
                            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                            accent={saveStatus === 'saved'}
                            label={
                              saveStatus === 'saved'  ? '✓ Saved to library'
                              : saveStatus === 'saving' ? 'Saving…'
                              : saveStatus === 'error'  ? '↺ Retry save'
                              : '🔖 Save to library'
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading skeleton */}
          {state === 'LOADING' && (
            <div style={{ padding: '4px 0' }}>
              {[72, 88, 60, 80].map((w, i) => (
                <div key={i} style={{
                  height: 9, borderRadius: 5, marginBottom: 9, width: `${w}%`,
                  background: `linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 50%, var(--surface-2) 75%)`,
                  backgroundSize: '200% 100%',
                  animation: `gistSkel ${1.2 + i * 0.1}s ease infinite`,
                }} />
              ))}
            </div>
          )}

          {/* Streaming text with blinking cursor */}
          {state === 'STREAMING' && (
            <div style={{
              fontSize: 12.5, color: INK2, lineHeight: 1.7,
              userSelect: 'text', cursor: 'text',
            }}>
              <MdText text={streamingText} />
              <span style={{
                display: 'inline-block', width: 2, height: 13,
                background: accentColor, marginLeft: 2, verticalAlign: 'text-bottom',
                animation: 'gistBlink 0.9s step-end infinite',
              }} />
            </div>
          )}

          {/* Error card */}
          {state === 'ERROR' && (() => {
            const meta = getErrorMeta(error, errorCode);
            return (
              <div style={{
                background: 'oklch(0.20 0.04 25 / 0.25)',
                border: '1px solid oklch(0.50 0.10 25 / 0.35)',
                borderLeft: '3px solid oklch(0.65 0.14 25)',
                borderRadius: 8, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, fontFamily: MONO, color: 'oklch(0.75 0.14 25)', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {meta.title}
                </div>
                <div style={{ fontSize: 11.5, color: 'oklch(0.70 0.08 25)', lineHeight: 1.55, marginBottom: 5 }}>
                  {error ?? 'Something went wrong.'}
                </div>
                <div style={{ fontSize: 10.5, color: 'oklch(0.55 0.05 25)', lineHeight: 1.4 }}>
                  {meta.hint}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Input bar ── */}
        <div style={{
          padding: '8px 10px',
          borderTop: `1px solid ${HAIRLINE}`,
          background: BG_ELEVATED, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              className="gist-fp-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
                if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); }
                else e.stopPropagation();
              }}
              disabled={isInputDisabled}
              placeholder={isInputDisabled ? 'Gist something to chat…' : 'Ask a follow-up…'}
              style={{
                flex: 1, background: BG_INPUT,
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 6, padding: '6px 10px',
                fontSize: 12, color: INK, fontFamily: FONT,
                cursor: isInputDisabled ? 'not-allowed' : 'text',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
                opacity: isInputDisabled ? 0.5 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isInputDisabled}
              style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                border: `1px solid ${input.trim() && !isInputDisabled ? accentColor + '45' : HAIRLINE}`,
                background: input.trim() && !isInputDisabled ? accentColor + '18' : 'oklch(1 0 0 / 0.03)',
                color: input.trim() && !isInputDisabled ? accentColor : INK3,
                cursor: input.trim() && !isInputDisabled ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
                opacity: !input.trim() || isInputDisabled ? 0.4 : 1,
              }}
            >
              <IcoSend />
            </button>
          </div>
        </div>

        {/* ── Resize handle ── */}
        {!isSidebarMode && (
          <div
            onMouseDown={onResizeMouseDown}
            data-resize=""
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 18, height: 18,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: 4,
            }}
          >
            <svg width={8} height={8} viewBox="0 0 8 8" fill="oklch(0.35 0 0)">
              <circle cx="7" cy="7" r="1"/>
              <circle cx="4" cy="7" r="1"/>
              <circle cx="7" cy="4" r="1"/>
            </svg>
          </div>
        )}
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function calcInitPos(anchor) {
  if (!anchor) return { x: 20, y: 60 };
  const x = Math.max(MARGIN, Math.min(anchor.x, (window.innerWidth || 800) - DEFAULT_W - MARGIN));
  const y = Math.max(MARGIN, anchor.y + (anchor.height ?? 0) + 14);
  return { x, y };
}
