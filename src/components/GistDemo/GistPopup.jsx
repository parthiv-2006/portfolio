import React, { useState } from 'react';
import { GistCaptureView } from './GistCaptureView';
import { GistLibraryView } from './GistLibraryView';
import { GistSynapseView } from './GistSynapseView';
import { GistSettingsView } from './GistSettingsView';

const T = {
  bg: 'var(--bg)', bgElevated: 'var(--surface)', bgHover: 'var(--surface-2)',
  bgActive: 'var(--surface-3)', border: 'var(--hairline)', borderMid: 'var(--hairline-2)',
  text: 'var(--ink)', textSub: 'var(--ink-2)', textMuted: 'var(--ink-3)', textDim: 'var(--ink-4)',
  accent: 'var(--accent)', accentBg: 'var(--accent-bg)', accentInk: 'var(--accent-ink)',
  accentBorder: 'var(--accent-border)', accentGlow: 'var(--accent-glow)',
};
const FONT = '"Inter", -apple-system, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

function GistMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)" />
        <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7"
          stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)" />
        <path d="M 14 8.5 Q 14.5 13.5 14 18.5" stroke="oklch(0.20 0.04 150)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.2px', color: T.text, fontFamily: MONO }}>gist</span>
    </div>
  );
}

const TABS = [
  {
    id: 'capture', label: 'Capture',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'library', label: 'Library',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'synapse', label: 'Synapse',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
        <line x1="12" y1="7" x2="5" y2="17" /><line x1="12" y1="7" x2="19" y2="17" /><line x1="5" y1="19" x2="19" y2="19" />
      </svg>
    ),
  },
  {
    id: 'settings', label: 'Settings',
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const FOOTER_TEXT = {
  capture: 'Select text on any page to begin',
  library: 'Your personal knowledge base',
  synapse: 'Semantic knowledge graph',
  settings: 'Preferences & API configuration',
};

export function GistPopup({ onCaptureStart, captureResult, onDismissResult, initialTab = 'capture' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div style={{
      fontFamily: FONT,
      background: T.bg,
      color: T.text,
      width: '340px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px oklch(0 0 0 / 0.65), 0 0 0 1px oklch(1 0 0 / 0.07)',
      maxHeight: '540px',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px',
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        <GistMark />
        <span style={{
          fontSize: '9.5px', color: T.textDim, fontFamily: MONO,
          padding: '2px 6px', background: T.bgElevated,
          border: `1px solid ${T.border}`, borderRadius: '3px', letterSpacing: '0.04em',
        }}>v1.0</span>
      </header>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        {TABS.map(({ id, label, icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                background: 'none', border: 'none',
                borderBottom: active ? `2px solid ${T.accent}` : '2px solid transparent',
                padding: '8px 0',
                fontSize: '10px',
                fontWeight: active ? 600 : 500,
                color: active ? T.text : T.textMuted,
                cursor: 'pointer',
                transition: 'color 120ms ease',
                fontFamily: FONT,
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ color: active ? T.accent : T.textDim, display: 'flex', transition: 'color 120ms ease' }}>
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Body — scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--hairline-2) transparent',
      }}>
        {activeTab === 'capture' && (
          <GistCaptureView
            onCaptureStart={onCaptureStart}
            captureResult={captureResult}
            onDismissResult={onDismissResult}
          />
        )}
        {activeTab === 'library' && <GistLibraryView />}
        {activeTab === 'synapse' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
            <GistSynapseView />
          </div>
        )}
        {activeTab === 'settings' && <GistSettingsView />}
      </div>

      {/* Footer */}
      <footer style={{
        padding: '7px 14px',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: '8px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: T.accent,
          boxShadow: `0 0 6px ${T.accentGlow}`,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '10.5px', color: T.textDim, fontFamily: MONO, letterSpacing: '0.02em' }}>
          {FOOTER_TEXT[activeTab]}
        </span>
      </footer>
    </div>
  );
}
