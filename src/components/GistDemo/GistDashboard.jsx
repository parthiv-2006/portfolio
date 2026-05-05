import React, { useEffect, useState } from 'react';
import { GistHomeView }    from './GistHomeView';
import { GistLibraryView } from './GistLibraryView';
import { GistSynapseView } from './GistSynapseView';
import { GistRecallView }  from './GistRecallView';
import { GistSettingsView } from './GistSettingsView';
import styles from './GistDashboard.module.css';

const BACKEND = 'https://gist-vc8m.onrender.com';

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconLibrary() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconSynapse() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
      <line x1="12" y1="7" x2="5" y2="17" />
      <line x1="12" y1="7" x2="19" y2="17" />
      <line x1="5"  y1="19" x2="19" y2="19" />
    </svg>
  );
}

function IconRecall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74" />
      <path d="M3 3v4h4" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// ── GistMark ───────────────────────────────────────────────────────────────────

function GistMark() {
  return (
    <div className={styles.sidebarLogoMark}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)" />
        <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7"
          stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)" />
        <path d="M 14 8.5 Q 14.5 13.5 14 18.5" stroke="oklch(0.20 0.04 150)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Streak helpers ─────────────────────────────────────────────────────────────

function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function computeStreak(items) {
  const days = new Set(items.map((item) => dayKey(new Date(item.created_at))));
  const now = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return days.has(dayKey(d));
  });
  const todayHasGist = days.has(dayKey(now));
  let streak = 0;
  for (let i = todayHasGist ? 0 : 1; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (days.has(dayKey(d))) streak++;
    else break;
  }
  return { streak, last7 };
}

// ── Recall due helpers ─────────────────────────────────────────────────────────

const DAYS7  = 7  * 24 * 3600_000;
const DAYS14 = 14 * 24 * 3600_000;
const DAYS1  = 1  * 24 * 3600_000;

function countRecallDue(items) {
  const now = Date.now();
  return items.filter((item) => {
    if (!item.id) return false;
    const age = now - new Date(item.created_at).getTime();
    if (age < DAYS7) return false;
    let rev = null;
    try { rev = JSON.parse(localStorage.getItem(`recall_${item.id}`)); } catch {}
    if (!rev) return true;
    if (rev.score === 'again') return now - rev.reviewedAt > DAYS1;
    return now - rev.reviewedAt > DAYS14;
  }).length;
}

// ── Nav config ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home',     label: 'Overview', icon: <IconHome /> },
  { id: 'library',  label: 'Library',  icon: <IconLibrary /> },
  { id: 'synapse',  label: 'Synapse',  icon: <IconSynapse /> },
  { id: 'recall',   label: 'Recall',   icon: <IconRecall /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings /> },
];

// ── GistDashboard ──────────────────────────────────────────────────────────────

export function GistDashboard({ onBack }) {
  const [route, setRoute]          = useState('home');
  const [pendingTag, setPendingTag] = useState(null);
  const [recallDue, setRecallDue]  = useState(0);
  const [streak, setStreak]        = useState(0);
  const [last7, setLast7]          = useState(Array(7).fill(false));

  useEffect(() => {
    fetch(`${BACKEND}/library`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then(({ items }) => {
        setRecallDue(countRecallDue(items));
        const { streak: s, last7: l7 } = computeStreak(items);
        setStreak(s);
        setLast7(l7);
      })
      .catch(() => {});
  }, []);

  const handleTagClick = (tag) => {
    setPendingTag(tag);
    setRoute('library');
  };

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>

        {/* Back to article */}
        <button className={styles.backBtn} onClick={onBack}>
          <IconArrowLeft />
          Back to article
        </button>

        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <GistMark />
          <div className={styles.sidebarLogoText}>
            <span className={styles.sidebarWordmark}>gist</span>
            <span className={styles.sidebarSubLabel}>knowledge garden</span>
          </div>
        </div>

        {/* Search button → focuses Library */}
        <button className={styles.searchBtn} onClick={() => setRoute('library')}>
          <IconSearch />
          <span className={styles.searchBtnLabel}>Search library…</span>
          <div className={styles.searchBtnKbds}>
            <kbd className={styles.kbd}>⌘</kbd>
            <kbd className={styles.kbd}>K</kbd>
          </div>
        </button>

        {/* Nav */}
        <p className={styles.workspaceLabel}>Workspace</p>
        <nav className={styles.navList}>
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`${styles.navItem} ${route === id ? styles.navItemActive : styles.navItemInactive}`}
              onClick={() => setRoute(id)}
            >
              <span className={styles.navIcon}>{icon}</span>
              {label}
              {id === 'recall' && recallDue > 0 && (
                <span className={styles.navBadge}>
                  {recallDue > 9 ? '9+' : recallDue}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarSpacer} />

        {/* Streak card */}
        {streak > 0 && (
          <div className={styles.streakCard}>
            <p className={styles.streakLabel}>Streak</p>
            <div className={styles.streakNumber}>
              <span className={styles.streakValue}>{streak}</span>
              <span className={styles.streakUnit}>days</span>
            </div>
            <div className={styles.streakBars}>
              {last7.map((active, i) => (
                <div key={i} className={active ? styles.streakBar : styles.streakBarDim} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <span className={styles.sidebarFooterText}>v1.0 · gist</span>
          <div className={styles.sidebarFooterDot} />
        </div>

      </aside>

      {/* ── Content ── */}
      <main className={styles.content}>
        {route === 'home' && (
          <GistHomeView
            onTagClick={handleTagClick}
            onRecallClick={() => setRoute('recall')}
            recallDue={recallDue}
          />
        )}
        {route === 'library' && (
          <GistLibraryView
            initialTag={pendingTag}
            onTagConsumed={() => setPendingTag(null)}
          />
        )}
        {route === 'synapse' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <GistSynapseView />
          </div>
        )}
        {route === 'recall' && (
          <GistRecallView onQueueSize={(n) => setRecallDue(n)} />
        )}
        {route === 'settings' && <GistSettingsView />}
      </main>

    </div>
  );
}
