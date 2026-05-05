import React, { useState } from 'react';

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

function IconCapture() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconSidebar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M15 3v18" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconGrip() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      {[3, 7].map((cx) => [2, 5.5, 9].map((cy) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" fill="currentColor" />
      )))}
    </svg>
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        width: '34px', height: '19px', borderRadius: '10px',
        background: enabled ? T.accent : T.bgActive,
        border: `1px solid ${enabled ? T.accent : T.borderMid}`,
        cursor: 'pointer', position: 'relative',
        transition: 'all 200ms ease', padding: 0, outline: 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: enabled ? '15px' : '2px',
        width: '13px', height: '13px', borderRadius: '50%',
        background: enabled ? T.accentInk : T.textSub,
        transition: 'left 200ms ease',
        boxShadow: '0 1px 3px oklch(0 0 0 / 0.4)',
      }} />
    </button>
  );
}

function KbdSet({ keys }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {keys.map((key, i) => (
        <React.Fragment key={key}>
          {i > 0 && <span style={{ fontSize: '9px', color: T.textDim, margin: '0 1px' }}>+</span>}
          <kbd style={{
            background: T.bgActive, border: `1px solid ${T.borderMid}`, borderBottomWidth: '2px',
            borderRadius: '4px', padding: '2px 5px', fontSize: '10px',
            fontFamily: MONO, color: T.textSub, fontWeight: 500, lineHeight: 1.5, display: 'inline-block',
          }}>{key}</kbd>
        </React.Fragment>
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, subtitle, rightSlot, onClick, accent = false }) {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;
  const border = accent ? T.accentBorder : hovered && isClickable ? T.borderMid : T.border;
  const iconBg = accent ? T.accentBg : hovered && isClickable ? T.bgActive : T.bgHover;
  const iconBorder = accent ? T.accentBorder : T.border;
  const iconColor = accent ? T.accent : hovered && isClickable ? T.textMuted : T.textDim;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.bgElevated, border: `1px solid ${border}`,
        borderRadius: '8px', padding: '10px 12px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'border-color 150ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '7px',
          background: iconBg, border: `1px solid ${iconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor, transition: 'all 150ms ease', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: T.text, lineHeight: 1.2, marginBottom: '2px' }}>{title}</div>
          <div style={{ fontSize: '10.5px', color: T.textMuted, lineHeight: 1.3 }}>{subtitle}</div>
        </div>
      </div>
      {rightSlot && <div style={{ flexShrink: 0 }}>{rightSlot}</div>}
    </div>
  );
}

/* Capture result toast shown after a successful gist save */
function CaptureResult({ result, onClose }) {
  // Error state
  if (result.error) {
    return (
      <div style={{
        background: 'oklch(0.25 0.05 25 / 0.15)', border: '1px solid oklch(0.50 0.12 25 / 0.3)',
        borderLeft: '2px solid oklch(0.65 0.15 25)', borderRadius: '7px',
        padding: '9px 11px', marginTop: '6px', position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.72 0.15 25)', padding: 0, display: 'flex' }}
          aria-label="Dismiss"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </button>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'oklch(0.72 0.15 25)', fontFamily: MONO, marginBottom: '4px' }}>
          Error
        </div>
        <p style={{ margin: 0, fontSize: '11.5px', color: 'oklch(0.72 0.15 25)', lineHeight: 1.5, paddingRight: '16px' }}>
          {result.error}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: T.accentBg, border: `1px solid ${T.accentBorder}`,
      borderRadius: '8px', padding: '10px 12px', marginTop: '6px',
      position: 'relative',
    }}>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 0, display: 'flex' }}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </button>
      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: T.accent, fontFamily: MONO, marginBottom: '5px' }}>
        ✓ Gist saved
      </div>
      <p style={{ margin: 0, fontSize: '11.5px', color: T.text, lineHeight: 1.55 }}>{result.explanation}</p>
      {result.category && (
        <span style={{
          display: 'inline-block', marginTop: '6px',
          fontSize: '9px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          padding: '1.5px 5px', borderRadius: '4px',
          background: 'oklch(0.75 0.11 150 / 0.12)', color: T.accent,
          border: '1px solid oklch(0.75 0.11 150 / 0.25)',
        }}>{result.category}</span>
      )}
    </div>
  );
}

export function GistCaptureView({ onCaptureStart, captureResult, onDismissResult }) {
  const [autoGistEnabled, setAutoGistEnabled] = useState(
    localStorage.getItem('gist_demo_autoGist') === 'true'
  );
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(null);

  const handleAutoGistToggle = () => {
    const next = !autoGistEnabled;
    setAutoGistEnabled(next);
    localStorage.setItem('gist_demo_autoGist', String(next));
  };

  const handleVisualCapture = () => {
    onCaptureStart?.();
  };

  return (
    <main style={{ padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p style={{ margin: '0 0 4px', fontSize: '11.5px', color: T.textMuted, lineHeight: 1.6 }}>
        Select text in the article below, then click <strong style={{ color: T.text }}>"Gist it!"</strong> to capture. Or drag to screenshot any area.
      </p>

      <FeatureCard
        icon={<IconCapture />}
        title="Visual Capture"
        subtitle="Drag to select any area of the page"
        rightSlot={<KbdSet keys={['Alt', '⇧', 'G']} />}
        onClick={handleVisualCapture}
      />

      <FeatureCard
        icon={<IconSidebar />}
        title="Sidebar Mode"
        subtitle="Persistent panel on the right"
        onClick={() => {
          /* Web demo: sidebar not applicable outside extension */
        }}
      />

      <FeatureCard
        icon={<IconEye />}
        title="AutoGist"
        subtitle="Ambient scroll summary"
        accent={autoGistEnabled}
        rightSlot={<Toggle enabled={autoGistEnabled} onToggle={handleAutoGistToggle} />}
      />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.bgElevated, border: `1px solid ${T.border}`,
        borderRadius: '8px', padding: '9px 12px',
      }}>
        <span style={{ fontSize: '11.5px', color: T.textMuted, fontWeight: 500 }}>Quick text gist</span>
        <KbdSet keys={['Ctrl', '⇧', 'E']} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '9px',
        background: T.bgElevated, border: `1px solid ${T.border}`,
        borderRadius: '8px', padding: '9px 12px',
      }}>
        <span style={{ color: T.textDim, display: 'flex', flexShrink: 0, marginTop: '1px' }}><IconGrip /></span>
        <p style={{ margin: 0, fontSize: '11.5px', color: T.textMuted, lineHeight: 1.55 }}>
          The panel is <strong style={{ color: T.text }}>draggable</strong> and{' '}
          <strong style={{ color: T.text }}>resizable</strong> — grab the header or corner.
        </p>
      </div>

      {captureError && (
        <div style={{ fontSize: '11.5px', color: 'oklch(0.72 0.15 25)', padding: '8px 10px', background: 'oklch(0.25 0.05 25 / 0.12)', borderRadius: '7px', border: '1px solid oklch(0.50 0.12 25 / 0.25)' }}>
          {captureError}
        </div>
      )}

      {captureResult && <CaptureResult result={captureResult} onClose={onDismissResult} />}
    </main>
  );
}
