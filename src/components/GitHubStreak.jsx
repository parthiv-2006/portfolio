import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GITHUB_USERNAME = 'parthiv-2006';

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
    if (!days.length) return { current: 0, longest: 0, todayCount: 0, lastActive: null, streakDates: new Set() };

    const today = daysAgo(0);
    const map = Object.fromEntries(days.map(d => [d.date, d.count]));
    const todayCount = map[today] ?? 0;

    const streakDates = new Set();
    let back = todayCount > 0 ? 0 : 1;
    while ((map[daysAgo(back)] ?? 0) > 0) {
        streakDates.add(daysAgo(back));
        back++;
    }

    let longest = 0, run = 0;
    for (const d of days) {
        run = d.count > 0 ? run + 1 : 0;
        if (run > longest) longest = run;
    }

    let lastActive = null;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) { lastActive = days[i].date; break; }
    }

    return { current: streakDates.size, longest, todayCount, lastActive, streakDates };
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

function Counter({ value }) {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);
    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }
        const duration = 900;
        const start = Date.now();
        const tick = () => {
            const t = Math.min((Date.now() - start) / duration, 1);
            setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value]);
    return <>{display}</>;
}

// Waveform: variable-height bars where height = commit intensity, accent = streak days
function CommitWaveform({ contributions, streakDates, numDays = 35 }) {
    const map = Object.fromEntries(contributions.map(d => [d.date, d.count]));
    const cells = Array.from({ length: numDays }, (_, i) => {
        const date = daysAgo(numDays - 1 - i);
        const count = map[date] ?? 0;
        return { date, count, inStreak: streakDates.has(date) };
    });

    const maxCount = Math.max(...cells.map(c => c.count), 1);

    return (
        <div className="flex items-end gap-[2px] w-full" style={{ height: '48px' }}>
            {cells.map(({ date, count, inStreak }, i) => {
                const pct = count > 0 ? Math.max(count / maxCount, 0.18) : 0.07;
                const bg = inStreak && count > 0
                    ? 'var(--color-accent)'
                    : count > 0
                    ? 'rgba(226,160,78,0.22)'
                    : 'rgba(255,255,255,0.05)';
                return (
                    <motion.div
                        key={date}
                        className="flex-1 rounded-[1px]"
                        title={`${count} commit${count !== 1 ? 's' : ''} · ${date}`}
                        style={{ background: bg }}
                        initial={{ height: '7%' }}
                        animate={{ height: `${pct * 100}%` }}
                        transition={{
                            duration: 0.45,
                            delay: i * 0.008,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function GitHubStreak({ compact = false }) {
    const { data, loading } = useContributions();
    const { current, longest, todayCount, lastActive, streakDates } = computeStreaks(data);

    const today = daysAgo(0);
    const isActiveToday = lastActive === today;
    const atRisk = !isActiveToday && lastActive === daysAgo(1) && current > 0;

    const statusLabel = isActiveToday ? 'active today' : atRisk ? 'commit to keep it' : current > 0 ? 'active' : '—';
    const statusColor = isActiveToday ? 'text-accent' : atRisk ? 'text-yellow-400/80' : 'text-text-dim';
    const dotColor   = isActiveToday ? 'bg-accent'  : atRisk ? 'bg-yellow-400/80'  : 'bg-text-dim';

    // ── Compact pill ─────────────────────────────────────────────────────────
    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
            >
                {loading ? (
                    <div className="h-9 w-56 rounded-lg bg-surface-light/30 animate-pulse" />
                ) : (
                    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/[0.06] bg-surface/60">
                        <span className="font-mono font-semibold text-text text-sm tabular-nums">
                            <Counter value={current} />d streak
                        </span>
                        <span className="w-px h-3.5 bg-white/[0.06] shrink-0" />
                        <span className="font-mono text-text-dim text-xs tabular-nums">
                            best {longest}d
                        </span>
                        <span className="w-px h-3.5 bg-white/[0.06] shrink-0" />
                        <span className={`flex items-center gap-1.5 text-xs font-mono ${statusColor}`}>
                            <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
                                style={isActiveToday ? { animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' } : {}}
                            />
                            {statusLabel}
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
            className="rounded-xl border border-white/[0.06] bg-surface/40 p-5 md:p-6 mb-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                    Builder Streak
                </span>
                {!loading && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono ${statusColor}`}>
                        <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
                            style={isActiveToday ? { animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' } : {}}
                        />
                        {statusLabel}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    <div className="h-10 w-28 rounded bg-surface-light/30 animate-pulse" />
                    <div className="h-12 w-full rounded bg-surface-light/20 animate-pulse" />
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <div className="flex items-baseline gap-1.5">
                                <span
                                    className="font-mono font-bold text-accent tabular-nums leading-none"
                                    style={{ fontSize: 'clamp(2.5rem, 6vw, 3.25rem)' }}
                                >
                                    <Counter value={current} />
                                </span>
                                <span className="font-mono text-text-dim text-sm mb-0.5">days</span>
                            </div>
                            <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.12em] mt-1">
                                current streak
                            </p>
                        </div>

                        <div className="flex items-end gap-5 pb-0.5">
                            <div className="text-right">
                                <p className="font-mono font-semibold text-text text-base tabular-nums leading-none">
                                    <Counter value={longest} />d
                                </p>
                                <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.1em] mt-1">best</p>
                            </div>
                            {todayCount > 0 && (
                                <div className="text-right">
                                    <p className="font-mono font-semibold text-text text-base tabular-nums leading-none">
                                        {todayCount}
                                    </p>
                                    <p className="font-mono text-[10px] text-text-dim uppercase tracking-[0.1em] mt-1">today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Waveform — the signature visual */}
                    <CommitWaveform contributions={data} streakDates={streakDates} numDays={35} />

                    <div className="flex items-center justify-between mt-1.5">
                        <span className="font-mono text-[9px] text-text-dim">35d ago</span>
                        <span className="font-mono text-[9px] text-text-dim">today ◂</span>
                    </div>
                </>
            )}
        </motion.div>
    );
}
