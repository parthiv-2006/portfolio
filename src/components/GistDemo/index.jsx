import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GistPopup }             from './GistPopup';
import { GistCaptureOverlay }    from './GistCaptureOverlay';
import { GistDashboard }         from './GistDashboard';
import { GistFloatingPopover }   from './GistFloatingPopover';
import { GistAutoGistWidget }    from './GistAutoGistWidget';
import './gist-tokens.css';

const BACKEND = 'https://gist-vc8m.onrender.com';

/* ── Sample article ── */
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

/* ── Icons ── */
function IconPuzzle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7H2V20a2 2 0 0 0 2 2h3.8v-1.5c0-1.5 1.2-2.7 2.7-2.7 1.5 0 2.7 1.2 2.7 2.7V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
    </svg>
  );
}

function TrafficLights() {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, flexShrink: 0 }} />
      ))}
    </div>
  );
}

/* ── "Gist it!" pill ── */
function GistItButton({ position, loading, onClick }) {
  if (!position) return null;
  return (
    <div style={{ position: 'absolute', left: position.x, top: position.y, zIndex: 60, transform: 'translateX(-50%)', pointerEvents: 'auto' }}>
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
          transition: 'all 150ms ease', whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'oklch(0.75 0.11 150 / 0.15)'; e.currentTarget.style.borderColor = 'oklch(0.75 0.11 150 / 0.8)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'oklch(0.16 0.004 120)'; e.currentTarget.style.borderColor = 'oklch(0.75 0.11 150 / 0.5)'; }}
      >
        {loading ? (
          <>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid oklch(0.75 0.11 150 / 0.3)', borderTopColor: 'oklch(0.75 0.11 150)', animation: 'gistBtnSpin 0.7s linear infinite' }} />
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

/* ── Main wrapper ── */
export default function GistDemoWrapper() {
  /* Extension popup (toolbar button) */
  const [popupOpen,     setPopupOpen]     = useState(false);
  /* Dashboard full-page mode */
  const [dashboardMode, setDashboardMode] = useState(false);
  /* Area-capture overlay */
  const [captureMode,   setCaptureMode]   = useState(false);
  /* Spinner shown while SSE request is being initiated */
  const [capturing,     setCapturing]     = useState(false);
  /* "Gist it!" button position */
  const [gistBtnPos,    setGistBtnPos]    = useState(null);

  /* ── Floating popover state ── */
  const [popoverOpen,        setPopoverOpen]        = useState(false);
  const [popoverState,       setPopoverState]       = useState('IDLE');   // IDLE|LOADING|STREAMING|DONE|ERROR
  const [popoverMessages,    setPopoverMessages]    = useState([]);       // { role, content }[]
  const [popoverStreamText,  setPopoverStreamText]  = useState('');
  const [popoverMode,        setPopoverMode]        = useState('standard');
  const [sidebarMode,        setSidebarMode]        = useState(false);
  const [saveStatus,         setSaveStatus]         = useState('unsaved'); // unsaved|saving|saved|error
  const [popoverAnchorRect,  setPopoverAnchorRect]  = useState(null);
  const [popoverError,       setPopoverError]       = useState(null);
  const [popoverErrorCode,   setPopoverErrorCode]   = useState(null);

  /* ── AutoGist state ── */
  const [autoGistEnabled,  setAutoGistEnabled]  = useState(
    localStorage.getItem('gist_demo_autoGist') === 'true'
  );
  const [widgetState,     setWidgetState]     = useState('idle');   // 'idle'|'loading'|'ready'
  const [widgetTakeaways, setWidgetTakeaways] = useState([]);

  /* ── Refs (stale-closure-safe access inside async callbacks) ── */
  const articleRef           = useRef(null);
  const viewportRef          = useRef(null);
  const selectedTextRef      = useRef('');   // latest highlighted text
  const anchorRectRef        = useRef(null); // selection bounding rect relative to viewport
  const popoverModeRef       = useRef('standard');
  const originalTextRef      = useRef('');  // original gisted text (for mode re-gist)
  const backendMsgsRef       = useRef([]);  // full history sent to backend
  const lastAutoGistTextRef  = useRef('');  // dedup: skip if same text as last extraction

  /* ─────────────────────────────────────────────────────────────────────────
     Text selection tracking
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? '';

      if (!text || !articleRef.current) {
        setGistBtnPos(null);
        selectedTextRef.current = '';
        anchorRectRef.current = null;
        return;
      }
      try {
        const range = sel.getRangeAt(0);
        if (!articleRef.current.contains(range.commonAncestorContainer)) {
          setGistBtnPos(null);
          selectedTextRef.current = '';
          anchorRectRef.current = null;
          return;
        }
        const rect   = range.getBoundingClientRect();
        const vpRect = viewportRef.current?.getBoundingClientRect();
        if (!vpRect) { setGistBtnPos(null); selectedTextRef.current = ''; return; }

        selectedTextRef.current = text;
        anchorRectRef.current = {
          x: rect.left - vpRect.left,
          y: rect.top  - vpRect.top,
          width:  rect.width,
          height: rect.height,
        };
        setGistBtnPos({
          x: rect.left + rect.width / 2 - vpRect.left,
          y: rect.top - 10 - vpRect.top,
        });
      } catch {
        setGistBtnPos(null);
        selectedTextRef.current = '';
        anchorRectRef.current = null;
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     SSE stream helper — calls onChunk with the accumulated text on each chunk
  ───────────────────────────────────────────────────────────────────────── */
  const streamSse = useCallback(async (res, onChunk) => {
    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full   = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') { buffer = ''; break; }
        try {
          const p = JSON.parse(payload);
          if (p.chunk) { full += p.chunk; onChunk(full); }
        } catch { /* ignore malformed */ }
      }
    }
    return full;
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     Library save (fire-and-forget)
  ───────────────────────────────────────────────────────────────────────── */
  const saveToLibrary = useCallback(async (original_text, explanation, mode, headers) => {
    try {
      await fetch(`${BACKEND}/library/save`, {
        method: 'POST', headers,
        body: JSON.stringify({
          original_text, explanation, mode,
          url: `https://${ARTICLE.url}`, gist_type: 'text',
        }),
      });
    } catch { /* non-fatal */ }
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     Core: fetch + stream an explanation and push it into the popover
  ───────────────────────────────────────────────────────────────────────── */
  const fetchAndStream = useCallback(async ({ text, mode, messages = [], anchor = null, saveAfter = true }) => {
    const apiKey  = localStorage.getItem('gist_demo_api_key') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Gemini-Api-Key'] = apiKey;

    if (anchor) setPopoverAnchorRect(anchor);

    setPopoverState('LOADING');
    setPopoverStreamText('');

    const body = {
      selected_text:    text,
      page_context:     ARTICLE.url,
      complexity_level: mode,
    };
    if (messages.length) body.messages = messages;

    const res = await fetch(`${BACKEND}/api/v1/simplify`, {
      method: 'POST', headers, body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const err = new Error(errData.error || `Server error (${res.status})`);
      err.code = errData.code;
      throw err;
    }

    setPopoverState('STREAMING');
    const explanation = await streamSse(res, (partial) => setPopoverStreamText(partial));

    if (!explanation) throw new Error('No explanation received. The backend may still be waking up — try again in a moment.');

    setPopoverStreamText('');

    if (saveAfter) saveToLibrary(text, explanation, mode, headers);

    return explanation;
  }, [streamSse, saveToLibrary]);

  /* ─────────────────────────────────────────────────────────────────────────
     Handle "Gist it!" click
  ───────────────────────────────────────────────────────────────────────── */
  const handleGistIt = useCallback(async () => {
    const text = selectedTextRef.current;
    if (!text || capturing) return;

    selectedTextRef.current = '';
    setGistBtnPos(null);
    window.getSelection()?.removeAllRanges();

    /* Open popover immediately in LOADING so the user sees feedback at once */
    originalTextRef.current  = text;
    backendMsgsRef.current   = [];
    const mode               = popoverModeRef.current;

    setPopoverOpen(true);
    setPopoverMessages([]);
    setPopoverStreamText('');
    setSaveStatus('unsaved');
    setPopoverError(null);
    setPopoverErrorCode(null);
    setCapturing(true);

    try {
      const explanation = await fetchAndStream({
        text,
        mode,
        anchor: anchorRectRef.current,
      });

      const modelMsg = { role: 'model', content: explanation };
      setPopoverMessages([modelMsg]);
      setPopoverState('DONE');
      backendMsgsRef.current = [
        { role: 'user',  content: text },
        { role: 'model', content: explanation },
      ];
    } catch (err) {
      setPopoverState('ERROR');
      setPopoverError(err.message);
      setPopoverErrorCode(err.code ?? null);
    } finally {
      setCapturing(false);
    }
  }, [capturing, fetchAndStream]);

  /* ─────────────────────────────────────────────────────────────────────────
     Visual area capture
  ───────────────────────────────────────────────────────────────────────── */
  const handleCaptureArea = useCallback(async (rect) => {
    setCaptureMode(false);

    /* Extract text from paragraphs that overlap the drawn rect */
    const paraEls = articleRef.current?.querySelectorAll('p') ?? [];
    let capturedText = '';
    for (const el of paraEls) {
      const elRect = el.getBoundingClientRect();
      if (
        elRect.bottom > rect.y && elRect.top    < rect.y + rect.height &&
        elRect.right  > rect.x && elRect.left   < rect.x + rect.width
      ) {
        capturedText += (capturedText ? ' ' : '') + el.textContent;
      }
    }
    if (!capturedText) capturedText = ARTICLE.paragraphs[0];

    originalTextRef.current = capturedText;
    backendMsgsRef.current  = [];
    const mode              = popoverModeRef.current;

    setPopoverOpen(true);
    setPopoverMessages([]);
    setPopoverStreamText('');
    setSaveStatus('unsaved');
    setPopoverError(null);
    setPopoverErrorCode(null);
    /* Position popover top-left for captures (no text-selection anchor) */
    setPopoverAnchorRect({ x: 20, y: 60, width: 0, height: 0 });
    setCapturing(true);

    try {
      const explanation = await fetchAndStream({ text: capturedText, mode });

      setPopoverMessages([{ role: 'model', content: explanation }]);
      setPopoverState('DONE');
      backendMsgsRef.current = [
        { role: 'user',  content: capturedText },
        { role: 'model', content: explanation  },
      ];
    } catch (err) {
      setPopoverState('ERROR');
      setPopoverError(err.message);
      setPopoverErrorCode(err.code ?? null);
    } finally {
      setCapturing(false);
    }
  }, [fetchAndStream]);

  /* ─────────────────────────────────────────────────────────────────────────
     Follow-up chat message
  ───────────────────────────────────────────────────────────────────────── */
  const handleSendFollowUp = useCallback(async (query) => {
    const mode    = popoverModeRef.current;
    const history = backendMsgsRef.current;

    /* Optimistically add the user bubble */
    setPopoverMessages(prev => [...prev, { role: 'user', content: query }]);
    setSaveStatus('unsaved');

    try {
      const explanation = await fetchAndStream({
        text:      query,
        mode,
        messages:  history,
        saveAfter: false,
      });

      const modelMsg = { role: 'model', content: explanation };
      setPopoverMessages(prev => [...prev, modelMsg]);
      setPopoverState('DONE');
      backendMsgsRef.current = [
        ...history,
        { role: 'user',  content: query       },
        { role: 'model', content: explanation  },
      ];
    } catch (err) {
      /* Roll back the optimistic user bubble */
      setPopoverMessages(prev => prev.slice(0, -1));
      setPopoverState('ERROR');
      setPopoverError(err.message);
      setPopoverErrorCode(err.code ?? null);
    }
  }, [fetchAndStream]);

  /* ─────────────────────────────────────────────────────────────────────────
     Mode change — re-gists the original text with the new mode
  ───────────────────────────────────────────────────────────────────────── */
  const handleModeChange = useCallback(async (newMode) => {
    setPopoverMode(newMode);
    popoverModeRef.current = newMode;

    const text = originalTextRef.current;
    if (!text) return;

    backendMsgsRef.current = [];
    setPopoverMessages([]);
    setSaveStatus('unsaved');
    setPopoverError(null);
    setPopoverErrorCode(null);

    try {
      const explanation = await fetchAndStream({ text, mode: newMode });
      setPopoverMessages([{ role: 'model', content: explanation }]);
      setPopoverState('DONE');
      backendMsgsRef.current = [
        { role: 'user',  content: text        },
        { role: 'model', content: explanation },
      ];
    } catch (err) {
      setPopoverState('ERROR');
      setPopoverError(err.message);
      setPopoverErrorCode(err.code ?? null);
    }
  }, [fetchAndStream]);

  /* ─────────────────────────────────────────────────────────────────────────
     Manual save to library
  ───────────────────────────────────────────────────────────────────────── */
  const handleSaveGist = useCallback(async (content) => {
    setSaveStatus('saving');
    try {
      const apiKey  = localStorage.getItem('gist_demo_api_key') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-Gemini-Api-Key'] = apiKey;
      await saveToLibrary(
        originalTextRef.current || content,
        content,
        popoverModeRef.current,
        headers,
      );
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [saveToLibrary]);

  /* ─────────────────────────────────────────────────────────────────────────
     AutoGist toggle + scroll observer
  ───────────────────────────────────────────────────────────────────────── */
  const handleAutoGistToggle = useCallback(() => {
    const next = !autoGistEnabled;
    setAutoGistEnabled(next);
    localStorage.setItem('gist_demo_autoGist', String(next));
    if (!next) {
      setWidgetState('idle');
      setWidgetTakeaways([]);
      lastAutoGistTextRef.current = '';
    }
  }, [autoGistEnabled]);

  useEffect(() => {
    if (!autoGistEnabled) return;

    const EXTRACTION_DELAY_MS = 2000;
    const INITIAL_DELAY_MS    = 3000;
    const MIN_TEXT_CHARS      = 100;
    const MAX_TEXT_CHARS      = 1500;
    const MIN_WORD_COUNT      = 5;

    function extractViewportText() {
      const container = articleRef.current;
      if (!container) return '';
      const containerRect = container.getBoundingClientRect();
      const elements = Array.from(
        container.querySelectorAll('p, h1, h2, h3, h4, li, blockquote')
      );
      const chunks = [];
      let totalChars = 0;
      for (const el of elements) {
        if (totalChars >= MAX_TEXT_CHARS) break;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < containerRect.top || rect.top > containerRect.bottom) continue;
        const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (text.split(' ').length < MIN_WORD_COUNT) continue;
        const remaining = MAX_TEXT_CHARS - totalChars;
        chunks.push(text.slice(0, remaining));
        totalChars += text.length;
      }
      return chunks.join(' ').slice(0, MAX_TEXT_CHARS);
    }

    async function fetchTakeaways(text) {
      const apiKey  = localStorage.getItem('gist_demo_api_key') || '';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-Gemini-Api-Key'] = apiKey;
      setWidgetState('loading');
      try {
        const res = await fetch(`${BACKEND}/autogist`, {
          method: 'POST', headers,
          body: JSON.stringify({ text_chunk: text, url: ARTICLE.url }),
        });
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const takeaways = data.takeaways ?? [];
        if (takeaways.length > 0) {
          setWidgetTakeaways(takeaways);
          setWidgetState('ready');
        } else {
          setWidgetState('idle');
        }
      } catch {
        setWidgetState('idle');
      }
    }

    function tryExtract() {
      const text = extractViewportText();
      if (text.length >= MIN_TEXT_CHARS && text !== lastAutoGistTextRef.current) {
        lastAutoGistTextRef.current = text;
        fetchTakeaways(text);
      }
    }

    let timer = null;
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(tryExtract, EXTRACTION_DELAY_MS);
    };

    const container = articleRef.current;
    if (!container) return;
    container.addEventListener('scroll', onScroll, { passive: true });
    timer = setTimeout(tryExtract, INITIAL_DELAY_MS);

    return () => {
      container.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [autoGistEnabled]);

  /* ─────────────────────────────────────────────────────────────────────────
     Sidebar toggle
  ───────────────────────────────────────────────────────────────────────── */
  const handleToggleSidebar = useCallback(() => {
    setSidebarMode(v => !v);
    /* Open the popover if it was closed and sidebar is being activated */
    setPopoverOpen(true);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     Other navigation handlers
  ───────────────────────────────────────────────────────────────────────── */
  const handleCaptureStart = useCallback(() => {
    setCaptureMode(true);
    setPopupOpen(false);
  }, []);

  const handleOpenDashboard = useCallback(() => {
    setDashboardMode(true);
    setPopupOpen(false);
  }, []);

  const handleBackToArticle = useCallback(() => {
    setDashboardMode(false);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     Derived
  ───────────────────────────────────────────────────────────────────────── */
  const urlBarText = dashboardMode
    ? 'chrome-extension://gist/dashboard.html'
    : ARTICLE.url;

  /* ─────────────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────────────── */
  return (
    // stopPropagation prevents clicks from bubbling to the parent project-card
    // onClick handler (which opens the full-screen dark project modal).
    <div className="gist-scope" onClick={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        borderRadius: '10px', overflow: 'hidden',
        background: '#1e1e1e',
        boxShadow: '0 32px 80px oklch(0 0 0 / 0.6)',
        border: '1px solid oklch(1 0 0 / 0.08)',
      }}>

        {/* ── Title bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 14px', height: '42px',
          background: '#2a2a2a',
          borderBottom: '1px solid oklch(1 0 0 / 0.07)',
          flexShrink: 0,
        }}>
          <TrafficLights />

          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '7px',
            background: '#1a1a1a', border: '1px solid oklch(1 0 0 / 0.1)',
            borderRadius: '6px', padding: '5px 10px',
            height: '26px', maxWidth: '480px', margin: '0 auto',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.04 150)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: '11.5px', color: 'oklch(0.65 0.01 95)', fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em', flex: 1 }}>
              {urlBarText}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (dashboardMode) handleBackToArticle();
                else setPopupOpen(v => !v);
              }}
              title="Gist Extension"
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: (popupOpen || dashboardMode) ? 'oklch(0.75 0.11 150 / 0.15)' : 'transparent',
                border: `1px solid ${(popupOpen || dashboardMode) ? 'oklch(0.75 0.11 150 / 0.4)' : 'transparent'}`,
                color: (popupOpen || dashboardMode) ? 'oklch(0.75 0.11 150)' : 'oklch(0.55 0 0)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease', flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (!popupOpen && !dashboardMode) { e.currentTarget.style.background = 'oklch(1 0 0 / 0.07)'; e.currentTarget.style.color = 'oklch(0.75 0 0)'; } }}
              onMouseLeave={(e) => { if (!popupOpen && !dashboardMode) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'oklch(0.55 0 0)'; } }}
            >
              <IconPuzzle />
            </button>
          </div>
        </div>

        {/* ── Viewport ── */}
        <div
          ref={viewportRef}
          style={{ flex: 1, position: 'relative', overflow: 'visible', display: 'flex' }}
        >
          {dashboardMode ? (
            <GistDashboard onBack={handleBackToArticle} />
          ) : (
            <>
              {/* Article */}
              <div
                ref={articleRef}
                onClick={() => {
                  if (popupOpen) setPopupOpen(false);
                  /* Floating popover only closes on click-outside when not in sidebar mode */
                  if (popoverOpen && !sidebarMode) setPopoverOpen(false);
                }}
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '40px 48px',
                  /* Shrink right padding to give sidebar breathing room */
                  paddingRight: sidebarMode && popoverOpen ? '388px' : '48px',
                  background: '#f8f6f1', color: '#1a1a18',
                  fontFamily: '"Inter", Georgia, serif',
                  scrollbarWidth: 'thin', scrollbarColor: '#c8c4b8 transparent',
                  transition: 'padding-right 250ms ease',
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
                    <strong>Interactive demo:</strong> Select any text then click <strong>"Gist it!"</strong> for a live AI explanation with chat. Click <strong>⊞</strong> to open the extension popup, or <strong>"Full library →"</strong> to open the full dashboard.
                  </span>
                </div>

                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7a72', marginBottom: '8px', fontFamily: '"Inter", sans-serif' }}>
                  Research · AI & Knowledge Management
                </p>
                <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111110', marginBottom: '16px', lineHeight: 1.25, fontFamily: '"Inter", sans-serif' }}>
                  {ARTICLE.title}
                </h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px', color: '#8a8a82', fontSize: '12px', fontFamily: '"Inter", sans-serif' }}>
                  <span>Research Digest</span><span>·</span><span>May 2026</span><span>·</span><span>5 min read</span>
                </div>

                {ARTICLE.paragraphs.map((para, i) => (
                  <p key={i} style={{ fontSize: '15px', lineHeight: 1.75, color: '#2a2a28', margin: '0 0 20px', fontFamily: 'Georgia, "Times New Roman", serif', cursor: 'text' }}>
                    {para}
                  </p>
                ))}
                <div style={{ height: '40px' }} />
              </div>

              {/* Capture overlay */}
              {captureMode && (
                <GistCaptureOverlay onCapture={handleCaptureArea} onCancel={() => setCaptureMode(false)} />
              )}

              {/* ── Extension popup (toolbar button) ── */}
              {popupOpen && !captureMode && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px', zIndex: 55,
                  maxHeight: 'calc(100% - 16px)',
                  display: 'flex', flexDirection: 'column',
                  animation: 'gistPopupIn 180ms cubic-bezier(0.22, 1, 0.36, 1) both',
                }}>
                  <style>{`@keyframes gistPopupIn{from{opacity:0;transform:translateY(-8px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
                  <GistPopup
                    onCaptureStart={handleCaptureStart}
                    onOpenDashboard={handleOpenDashboard}
                    onToggleSidebar={handleToggleSidebar}
                    isSidebarMode={sidebarMode}
                    onClose={() => setPopupOpen(false)}
                    autoGistEnabled={autoGistEnabled}
                    onAutoGistToggle={handleAutoGistToggle}
                  />
                </div>
              )}

              {/* ── Floating Gist popover ── */}
              {popoverOpen && !captureMode && (
                <GistFloatingPopover
                  state={popoverState}
                  messages={popoverMessages}
                  streamingText={popoverStreamText}
                  error={popoverError}
                  errorCode={popoverErrorCode}
                  anchorRect={popoverAnchorRect}
                  mode={popoverMode}
                  isSidebarMode={sidebarMode}
                  saveStatus={saveStatus}
                  onClose={() => { setPopoverOpen(false); setSidebarMode(false); }}
                  onModeChange={handleModeChange}
                  onSendMessage={handleSendFollowUp}
                  onSaveGist={handleSaveGist}
                  onToggleSidebar={handleToggleSidebar}
                />
              )}

              {/* Capturing spinner */}
              {capturing && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0 0 0 / 0.12)', backdropFilter: 'blur(2px)' }}>
                  <div style={{ background: 'oklch(0.16 0.004 120 / 0.95)', border: '1px solid oklch(0.75 0.11 150 / 0.3)', borderRadius: '12px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 40px oklch(0 0 0 / 0.5)' }}>
                    <div style={{ width: '14px', height: '14px', border: '2px solid oklch(0.75 0.11 150 / 0.25)', borderTopColor: 'oklch(0.75 0.11 150)', borderRadius: '50%', animation: 'gistBtnSpin 0.7s linear infinite' }} />
                    <span style={{ fontSize: '12.5px', color: 'oklch(0.78 0.006 95)', fontFamily: '"Inter", sans-serif' }}>Connecting to AI…</span>
                  </div>
                </div>
              )}

              {/* "Gist it!" pill button */}
              <GistItButton position={gistBtnPos} loading={capturing} onClick={handleGistIt} />

              {/* AutoGist ambient widget */}
              {autoGistEnabled && !captureMode && (
                <GistAutoGistWidget
                  state={widgetState}
                  takeaways={widgetTakeaways}
                  onDismiss={() => {
                    setWidgetState('idle');
                    setWidgetTakeaways([]);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
