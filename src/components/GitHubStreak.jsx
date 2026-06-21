import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap } from 'lucide-react';

const GITHUB_USERNAME = 'parthiv-2006';

// Module-level cache so multiple mounts share one fetch
let _cache = null;
let _promise = null;

function toDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toDateStr(d);
}

async function loadContributions() {
    if (_cache) return _cache;
    if (!_promise) {
        _promise = fetch(`https://github-contributions-api.deno.dev/${GITHUB_USERNAME}.json`)
            .then(r => (r.ok ? r.json() : null))
            .then(data => {
                if (!data) return (_cache = []);
                const today = daysAgo(0);
                _cache = data.contributions
                    .flat()
                    .map(d => ({ date: d.date, count: d.contributionCount }))
                    .filter(d => d.date <= today)
                    .sort((a, b) => a.date.localeCompare(b.date));
                return _cache;
            })
            .catch(() => (_cache = []));
    }
    return _promise;
}

function computeStreaks(days) {
    if (!days.length) return { current: 0, longest: 0, todayCount: 0, lastActive: null };

    const today = daysAgo(0);
    const map = Object.fromEntries(days.map(d => [d.date, d.count]));
    const todayCount = map[today] ?? 0;

    // Walk backwards: start from today if committed, else from yesterday
    let current = 0;
    let back = todayCount > 0 ? 0 : 1;
    while ((map[daysAgo(back)] ?? 0) > 0) { current++; back++; }

    let longest = 0, run = 0;
    for (const d of days) {
        run = d.count > 0 ? run + 1 : 0;
        if (run > longest) longest = run;
    }

    let lastActive = null;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) { lastActive = days[i].date; break; }
    }

    return { current, longest, todayCount, lastActive };
}

function useContributions() {
    const [data, setData] = useState(_cache ?? []);
    const [loading, setLoading] = useState(!_cache);
    useEffect(() => {
        if (_cache) return;
        loadContributions().then(d => { setData(d); setLoading(false); });
    }, []);
    return { data, loading };
}

// RAF-based counter that eases out from 0 → value
function Counter({ value }) {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);
    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }
        const duration = 900;
        const start = Date.now();
        const tick = () => {
            const t = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(eased * value));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value]);
    return <>{display}</>;
}

// Floating spark particles above the flame
function Sparks({ active }) {
    if (!active) return null;
    return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden>
            {[0, 1, 2, 3].map(i => (
                <span
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-accent/60"
                    style={{
                        left: `${(i - 1.5) * 9}px`,
                        animationName: 'streak-spark',
                        animationDuration: `${1.6 + i * 0.3}s`,
                        animationDelay: `${i * 0.4}s`,
                        animationTimingFunction: 'ease-out',
                        animationIterationCount: 'infinite',
                        opacity: 0,
                    }}
                />
            ))}
        </div>
    );
}

export default function GitHubStreak({ compact = false }) {
    const { data, loading } = useContributions();
    const { current, longest, todayCount, lastActive } = computeStreaks(data);

    const today = daysAgo(0);
    const isActiveToday = lastActive === today;
    const atRisk = !isActiveToday && lastActive === daysAgo(1) && current > 0;
    const progress = longest > 0 ? Math.min(current / longest, 1) : 0;

    const status = isActiveToday
        ? { label: 'on fire today', color: 'text-accent', dot: 'bg-accent', pulse: true }
        : atRisk
        ? { label: 'commit to keep it!', color: 'text-yellow-400', dot: 'bg-yellow-400', pulse: false }
        : { label: current > 0 ? 'active' : 'no streak yet', color: 'text-text-dim', dot: 'bg-text-dim', pulse: false };

    // ── Compact pill ──────────────────────────────────────────────────────────
    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
            >
                {loading ? (
                    <div className="h-8 w-52 rounded-full bg-surface-light/40 animate-pulse" />
                ) : (
                    <div
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/20 bg-surface/70 text-sm"
                        style={isActiveToday ? { boxShadow: '0 0 16px rgba(226,160,78,0.12)' } : {}}
                    >
                        <span
                            className="text-base leading-none"
                            style={{ filter: isActiveToday ? 'drop-shadow(0 0 4px rgba(226,160,78,0.6))' : 'none' }}
                        >
                            🔥
                        </span>
                        <span className="font-semibold text-text">
                            <Counter value={current} /> day streak
                        </span>
                        <span className="w-px h-3 bg-white/[0.08]" />
                        <span className="text-text-dim text-xs font-mono">best {longest}d</span>
                        <span className="w-px h-3 bg-white/[0.08]" />
                        <span className={`flex items-center gap-1.5 text-xs ${status.color}`}>
                            <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                                style={status.pulse ? { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' } : {}}
                            />
                            {status.label}
                        </span>
                    </div>
                )}
            </motion.div>
        );
    }

    // ── Full card ─────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl border border-accent/10 bg-surface/40 overflow-hidden mb-4"
            style={current > 0 ? { boxShadow: '0 0 40px rgba(226,160,78,0.06), 0 0 1px rgba(226,160,78,0.15) inset' } : {}}
        >
            {/* Ambient floor glow when active */}
            {current > 0 && (
                <div
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(226,160,78,0.09) 0%, transparent 70%)',
                    }}
                />
            )}

            <div className="relative p-5 md:p-6">
                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <Flame size={13} className="text-accent" />
                        <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                            Builder Streak
                        </span>
                    </div>
                    {!loading && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-mono ${status.color}`}>
                            <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                                style={status.pulse ? { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' } : {}}
                            />
                            {status.label}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        <div className="h-12 w-36 rounded-lg bg-surface-light/40 animate-pulse" />
                        <div className="h-2 w-full rounded-full bg-surface-light/40 animate-pulse" />
                        <div className="h-4 w-44 rounded bg-surface-light/30 animate-pulse" />
                    </div>
                ) : (
                    <>
                        {/* Metrics row */}
                        <div className="flex items-end gap-6 sm:gap-10 mb-5 flex-wrap">
                            {/* Current streak — hero number */}
                            <div className="relative flex flex-col">
                                <Sparks active={isActiveToday} />
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className="font-display italic leading-none tabular-nums"
                                        style={{
                                            fontSize: 'clamp(2.8rem, 6vw, 3.75rem)',
                                            color: '#E2A04E',
                                            textShadow: current > 0
                                                ? '0 0 24px rgba(226,160,78,0.45), 0 0 48px rgba(226,160,78,0.18)'
                                                : 'none',
                                        }}
                                    >
                                        <Counter value={current} />
                                    </span>
                                    <span className="text-text-dim text-sm font-mono mb-1">days</span>
                                </div>
                                <span className="text-text-dim text-[10px] font-mono mt-0.5 uppercase tracking-[0.12em]">
                                    current streak
                                </span>
                            </div>

                            <div className="w-px h-10 bg-white/[0.05] self-center hidden sm:block" />

                            {/* Personal best */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Trophy size={11} className="text-accent/50 shrink-0" />
                                    <span className="text-text font-semibold text-xl tabular-nums">
                                        <Counter value={longest} />
                                    </span>
                                    <span className="text-text-dim text-sm font-mono">days</span>
                                </div>
                                <span className="text-text-dim text-[10px] font-mono uppercase tracking-[0.12em]">
                                    personal best
                                </span>
                            </div>

                            {todayCount > 0 && (
                                <>
                                    <div className="w-px h-10 bg-white/[0.05] self-center hidden sm:block" />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Zap size={11} className="text-accent/50 shrink-0" />
                                            <span className="text-text font-semibold text-xl">{todayCount}</span>
                                        </div>
                                        <span className="text-text-dim text-[10px] font-mono uppercase tracking-[0.12em]">
                                            today
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Fire progress bar */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-mono text-text-dim">progress to best</span>
                                <span className="text-[10px] font-mono text-text-dim">
                                    {current}d / {longest}d
                                </span>
                            </div>
                            <div className="relative h-1.5 w-full rounded-full bg-surface-light/60 overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress * 100}%` }}
                                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                                    style={{
                                        background: 'linear-gradient(90deg, #E2A04E 0%, #f97316 55%, #ef4444 100%)',
                                        boxShadow: '0 0 8px rgba(226,160,78,0.5)',
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
