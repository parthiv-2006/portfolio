import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { computeStreaks, daysAgo, loadContributions, _resetCache } from '../lib/githubContributions';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

function useContributions() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const aliveRef = useRef(true);

    const load = useCallback(() => {
        setLoading(true);
        setFailed(false);
        loadContributions().then(({ days, error }) => {
            if (!aliveRef.current) return;
            setData(days);
            setFailed(Boolean(error) || days.length === 0);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        aliveRef.current = true;
        load();
        return () => { aliveRef.current = false; };
    }, [load]);

    const retry = useCallback(() => {
        _resetCache();
        load();
    }, [load]);

    return { data, loading, failed, retry };
}

function Counter({ value }) {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        // Hand-rolled rAF loop, so MotionConfig doesn't cover it.
        if (reducedMotion || value === 0) { setDisplay(value); return; }
        const duration = 900;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, reducedMotion]);

    return <>{display}</>;
}

function RetryPanel({ onRetry, label }) {
    return (
        <div role="alert" className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <p className="text-text-muted text-xs font-mono max-w-[18rem] leading-relaxed">{label}</p>
            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-full border border-accent/40 bg-accent/10 text-accent text-[10px] font-mono uppercase tracking-[0.1em] hover:bg-accent/20 transition-colors duration-200 cursor-pointer"
            >
                <RotateCw size={11} aria-hidden="true" />
                Retry
            </button>
        </div>
    );
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
    const total = cells.reduce((sum, c) => sum + c.count, 0);

    return (
        <div
            className="flex items-end gap-[2px] w-full"
            style={{ height: '48px' }}
            role="img"
            aria-label={`Daily commit activity for the last ${numDays} days, ${total} contribution${total !== 1 ? 's' : ''} total.`}
        >
            {cells.map(({ date, count, inStreak }, i) => {
                const pct = count > 0 ? Math.max(count / maxCount, 0.18) : 0.07;
                const bg = inStreak && count > 0
                    ? 'var(--color-accent)'
                    : count > 0
                    ? 'var(--color-accent-dim)'
                    : 'var(--color-border)';
                return (
                    <motion.div
                        key={date}
                        aria-hidden="true"
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
    const { data, loading, failed, retry } = useContributions();
    const { current, longest, todayCount, lastActive, streakDates } = computeStreaks(data);

    const today = daysAgo(0);
    const isActiveToday = lastActive === today;
    const atRisk = !isActiveToday && lastActive === daysAgo(1) && current > 0;

    const statusLabel = isActiveToday ? 'active today' : atRisk ? 'commit to keep it' : current > 0 ? 'active' : '—';
    // Theme tokens only — a literal yellow reads as washed-out mud in day mode.
    // A hollow dot marks "at risk", a filled + pulsing dot marks "active today".
    const statusColor = isActiveToday || atRisk ? 'text-accent' : 'text-text-dim';
    const dotClass = isActiveToday
        ? 'bg-accent animate-pulse'
        : atRisk
        ? 'border border-accent bg-transparent'
        : 'bg-text-dim';

    const statusDot = (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
    );

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
                    <>
                        <span className="sr-only" role="status">Loading builder streak</span>
                        {/* Same box as the loaded pill so the row doesn't jump */}
                        <div
                            aria-hidden="true"
                            className="shimmer h-[42px] w-full max-w-[19rem] rounded-lg border border-border bg-surface/60"
                        />
                    </>
                ) : failed ? (
                    <div
                        role="alert"
                        className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-lg border border-border bg-surface/60"
                    >
                        <span className="font-mono text-text-muted text-xs">streak unavailable</span>
                        <button
                            type="button"
                            onClick={retry}
                            className="inline-flex items-center gap-1 font-mono text-accent text-xs hover:underline underline-offset-2 cursor-pointer"
                        >
                            <RotateCw size={10} aria-hidden="true" />
                            retry
                        </button>
                    </div>
                ) : (
                    <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-lg border border-border bg-surface/60">
                        <span className="font-mono font-semibold text-text text-sm tabular-nums">
                            <Counter value={current} />d streak
                        </span>
                        <span className="w-px h-3.5 bg-border shrink-0 hidden sm:block" />
                        <span className="font-mono text-text-dim text-xs tabular-nums">
                            best {longest}d
                        </span>
                        <span className="w-px h-3.5 bg-border shrink-0 hidden sm:block" />
                        <span className={`flex items-center gap-1.5 text-xs font-mono ${statusColor}`}>
                            {statusDot}
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
            className="rounded-xl border border-border bg-surface/40 p-5 md:p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                    Builder Streak
                </span>
                {!loading && !failed && (
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono ${statusColor}`}>
                        {statusDot}
                        {statusLabel}
                    </div>
                )}
            </div>

            {loading ? (
                /* Skeleton mirrors the loaded card: big number, caption, waveform, axis */
                <>
                    <span className="sr-only" role="status">Loading builder streak</span>
                    <div aria-hidden="true">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <div
                                    className="shimmer w-24 rounded bg-surface-light/50"
                                    style={{ height: 'clamp(2.5rem, 6vw, 3.25rem)' }}
                                />
                                <div className="shimmer h-2.5 w-20 rounded bg-surface-light/50 mt-2" />
                            </div>
                            <div className="flex items-end gap-5 pb-0.5">
                                <div className="text-right">
                                    <div className="shimmer h-4 w-10 rounded bg-surface-light/50 ml-auto" />
                                    <div className="shimmer h-2.5 w-8 rounded bg-surface-light/50 mt-2 ml-auto" />
                                </div>
                            </div>
                        </div>
                        <div className="shimmer w-full rounded bg-surface-light/50" style={{ height: '48px' }} />
                        <div className="flex items-center justify-between mt-1.5">
                            <div className="shimmer h-2 w-12 rounded bg-surface-light/50" />
                            <div className="shimmer h-2 w-12 rounded bg-surface-light/50" />
                        </div>
                    </div>
                </>
            ) : failed ? (
                <RetryPanel onRetry={retry} label="Couldn't load streak data from GitHub right now." />
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

                    <div className="flex items-center justify-between mt-1.5" aria-hidden="true">
                        <span className="font-mono text-[9px] text-text-dim">35d ago</span>
                        <span className="font-mono text-[9px] text-text-dim">today ◂</span>
                    </div>
                </>
            )}
        </motion.div>
    );
}
