import React, { useEffect, useState } from 'react';
import styles from './GistSettingsView.module.css';

const BACKEND = 'https://gist-vc8m.onrender.com';

function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };
  return { msg, show };
}

function ToggleSwitch({ enabled, onToggle, ariaLabel }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={ariaLabel}
      style={{
        width: '34px', height: '19px', borderRadius: '10px',
        background: enabled ? 'var(--accent)' : 'var(--surface-3)',
        border: `1px solid ${enabled ? 'var(--accent)' : 'var(--hairline-2)'}`,
        cursor: 'pointer', position: 'relative',
        transition: 'all 200ms ease', padding: 0, outline: 'none', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: enabled ? '15px' : '2px',
        width: '13px', height: '13px', borderRadius: '50%',
        background: enabled ? 'var(--accent-ink)' : 'var(--ink-3)',
        transition: 'left 200ms ease',
        boxShadow: '0 1px 3px oklch(0 0 0 / 0.4)',
      }} />
    </button>
  );
}

function ToggleRow({ label, sub, enabled, onToggle, ariaLabel }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowInfo}>
        <div className={styles.rowLabel}>{label}</div>
        <div className={styles.rowSub}>{sub}</div>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} ariaLabel={ariaLabel} />
    </div>
  );
}

function IconSun() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  );
}

function IconExport() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light',  Icon: IconSun },
  { value: 'dark',   label: 'Dark',   Icon: IconMoon },
  { value: 'system', label: 'System', Icon: IconMonitor },
];

function EyeIcon({ off }) {
  return off ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export function GistSettingsView() {
  const [autoGist, setAutoGist]    = useState(false);
  const [sidebarMode, setSidebar]  = useState(false);
  const [clearConfirm, setClear]   = useState(false);
  const [clearing, setClearing]    = useState(false);
  const [apiKey, setApiKey]        = useState('');
  const [apiKeyShown, setShown]    = useState(false);
  const [apiKeySaved, setKeySaved] = useState(false);
  const [themePref, setThemePref]  = useState('dark');
  const toast = useToast();

  useEffect(() => {
    setAutoGist(localStorage.getItem('gist_demo_autoGist') === 'true');
    setSidebar(localStorage.getItem('gist_demo_sidebarMode') === 'true');
    setApiKey(localStorage.getItem('gist_demo_api_key') || '');
    setThemePref(localStorage.getItem('gist_demo_theme') || 'dark');
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('gist_demo_api_key', apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const toggle = (key, val, setter) => {
    setter(val);
    localStorage.setItem(key, String(val));
  };

  const handleExport = async () => {
    try {
      const r = await fetch(`${BACKEND}/library`);
      if (!r.ok) throw new Error('Failed to fetch library.');
      const data = await r.json();
      const blob = new Blob([JSON.stringify(data.items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `gist-library-${new Date().toISOString().slice(0, 10)}.json`;
      a.click(); URL.revokeObjectURL(url);
      toast.show('Library exported as JSON');
    } catch {
      toast.show('Export failed — check backend connection.');
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      const r = await fetch(`${BACKEND}/library`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      const items = data.items ?? [];
      await Promise.all(
        items.filter((i) => i.id).map((i) => fetch(`${BACKEND}/library/${i.id}`, { method: 'DELETE' }))
      );
      setClear(false);
      toast.show(`Deleted ${items.length} gist${items.length !== 1 ? 's' : ''}`);
    } catch {
      toast.show('Failed to clear library.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>Settings</p>

      {/* Capture Behavior */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Capture behavior</p>
        <ToggleRow
          label="AutoGist"
          sub="Automatically summarize content as you scroll long articles."
          enabled={autoGist}
          onToggle={() => toggle('gist_demo_autoGist', !autoGist, setAutoGist)}
          ariaLabel="Toggle AutoGist"
        />
      </section>

      {/* Layout */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Layout</p>
        <ToggleRow
          label="Sidebar mode"
          sub="Dock the explanation panel to the right side of the page."
          enabled={sidebarMode}
          onToggle={() => toggle('gist_demo_sidebarMode', !sidebarMode, setSidebar)}
          ariaLabel="Toggle sidebar mode"
        />
      </section>

      {/* Data management */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Data management</p>
        <div className={styles.actionRow}>
          <div className={styles.rowInfo}>
            <div className={styles.rowLabel}>Export library</div>
            <div className={styles.rowSub}>Download all saved gists as a JSON file.</div>
          </div>
          <button className={`${styles.actionBtn} ${styles.actionBtnDefault}`} onClick={handleExport}>
            <IconExport /> Export JSON
          </button>
        </div>

        {clearConfirm ? (
          <div className={styles.confirmBanner}>
            <p className={styles.confirmText}>This will permanently delete all saved gists. This cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYes} onClick={handleClearAll} disabled={clearing}>
                {clearing ? 'Deleting…' : 'Yes, delete all'}
              </button>
              <button className={styles.confirmNo} onClick={() => setClear(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={styles.actionRow}>
            <div className={styles.rowInfo}>
              <div className={styles.rowLabel}>Clear all gists</div>
              <div className={styles.rowSub}>Permanently remove every gist from your library.</div>
            </div>
            <button className={`${styles.actionBtn} ${styles.actionBtnDestructive}`} onClick={() => setClear(true)}>
              <IconTrash /> Clear all
            </button>
          </div>
        )}
      </section>

      {/* API Configuration */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>API Configuration</p>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <div className={styles.rowLabel}>Gemini API Key</div>
            <div className={styles.rowSub}>Required for AI features. Get yours at aistudio.google.com.</div>
          </div>
        </div>
        <div className={styles.apiKeyRow}>
          <div className={styles.apiKeyInputWrap}>
            <input
              type={apiKeyShown ? 'text' : 'password'}
              className={styles.apiKeyInput}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setKeySaved(false); }}
              placeholder="AIza..."
              spellCheck={false}
              autoComplete="off"
            />
            <button className={styles.apiKeyVisToggle} onClick={() => setShown((v) => !v)} type="button" aria-label={apiKeyShown ? 'Hide key' : 'Show key'}>
              <EyeIcon off={apiKeyShown} />
            </button>
          </div>
          <button className={`${styles.actionBtn} ${apiKeySaved ? styles.actionBtnSaved : styles.actionBtnDefault}`} onClick={handleSaveApiKey}>
            {apiKeySaved ? (apiKey.trim() ? 'Saved ✓' : 'Cleared ✓') : 'Save'}
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Appearance</p>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <div className={styles.rowLabel}>Theme</div>
            <div className={styles.rowSub}>Visual theme for the Gist extension.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const active = themePref === value;
            return (
              <button
                key={value}
                className={`${styles.themeOption} ${active ? styles.themeOptionActive : ''}`}
                onClick={() => { setThemePref(value); localStorage.setItem('gist_demo_theme', value); }}
                aria-pressed={active}
                type="button"
              >
                <span style={{ display: 'flex', flexShrink: 0 }}><Icon /></span>
                <span style={{ fontSize: '11.5px', fontWeight: 500 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {toast.msg && <div className={styles.toast}>{toast.msg}</div>}
    </div>
  );
}
