import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { computeStreaks, daysAgo, loadContributions } from '../lib/githubContributions';

function useContributions() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        let alive = true;
        loadContributions().then(({ days, error }) => {
            if (!alive) return;
            setData(days);
            setFailed(Boolean(error));
            setLoading(false);
        });
        return () => { alive = false; };
    }, []);
    return { data, loading, failed };
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
    const { data, loading, failed } = useContributions();
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
                ) : failed ? (
                    <div className="inline-flex items-center px-4 py-2.5 rounded-lg border border-white/[0.06] bg-surface/60">
                        <span className="font-mono text-text-dim text-xs">streak unavailable</span>
                    </div>
                ) : (
                    <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-lg border border-white/[0.06] bg-surface/60">
                        <span className="font-mono font-semibold text-text text-sm tabular-nums">
                            <Counter value={current} />d streak
                        </span>
                        <span className="w-px h-3.5 bg-white/[0.06] shrink-0 hidden sm:block" />
                        <span className="font-mono text-text-dim text-xs tabular-nums">
                            best {longest}d
                        </span>
                        <span className="w-px h-3.5 bg-white/[0.06] shrink-0 hidden sm:block" />
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
            className="rounded-xl border border-white/[0.06] bg-surface/40 p-5 md:p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                    Builder Streak
                </span>
                {!loading && !failed && (
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
            ) : failed ? (
                <div className="flex items-center justify-center py-8">
                    <span className="text-text-dim text-xs font-mono">Unable to load streak data.</span>
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
