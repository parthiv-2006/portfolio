import { useState, useEffect, useMemo, useCallback, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, ExternalLink, RotateCw } from 'lucide-react';
import { GITHUB_USERNAME, daysAgo, loadContributions, _resetCache } from '../lib/githubContributions';

const RANGES = [
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: '1y', days: 365 },
];

/** Determine which range has the highest contribution density */
function findBestRange(allData) {
    let bestIdx = 0;
    let bestDensity = 0;

    for (let i = 0; i < RANGES.length; i++) {
        const cutoffStr = daysAgo(RANGES[i].days);

        const slice = allData.filter((d) => d.date > cutoffStr);
        const total = slice.reduce((sum, d) => sum + d.count, 0);
        const density = total / RANGES[i].days;

        if (density > bestDensity) {
            bestDensity = density;
            bestIdx = i;
        }
    }

    return RANGES[bestIdx].days;
}

/** Maps a count to an intensity level 0-4 */
function getLevel(count, max) {
    if (count === 0) return 0;
    if (max === 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
}

const levelColors = {
    0: 'bg-surface-light/50 border-border',
    1: 'bg-accent/15 border-accent/10',
    2: 'bg-accent/30 border-accent/20',
    3: 'bg-accent/50 border-accent/30',
    4: 'bg-accent/75 border-accent/40 shadow-[0_0_6px_var(--color-accent-glow)]',
};

export default function GitHubGraph() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDays, setActiveDays] = useState(30);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [hasAutoSelected, setHasAutoSelected] = useState(false);
    const touchTimerRef = useRef(null);
    const aliveRef = useRef(true);
    // Both this graph and the landing-page copy can be mounted at once; a shared
    // layoutId would make the pill fly between them.
    const pillId = useId();

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        loadContributions().then(({ days, error: err }) => {
            if (!aliveRef.current) return;
            setAllData(days);
            setError(err || null);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        aliveRef.current = true;
        load();
        return () => {
            aliveRef.current = false;
            clearTimeout(touchTimerRef.current);
        };
    }, [load]);

    const retry = useCallback(() => {
        _resetCache();
        load();
    }, [load]);

    // Auto-select the best range once data loads, capped to 90d on narrow screens
    useEffect(() => {
        if (!loading && allData.length > 0 && !hasAutoSelected) {
            let best = findBestRange(allData);
            if (window.innerWidth < 480 && best === 365) best = 90;
            if (window.innerWidth < 360 && best > 30) best = 30;
            setActiveDays(best);
            setHasAutoSelected(true);
        }
    }, [loading, allData, hasAutoSelected]);

    // Slice data to current range
    const data = useMemo(() => {
        return allData.slice(-activeDays);
    }, [allData, activeDays]);

    const maxCount = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);
    const totalContributions = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);
    const activeCount = useMemo(() => data.filter((d) => d.count > 0).length, [data]);
    // A brand-new or fully private account returns real days that are all zero.
    const neverActive = useMemo(
        () => allData.length > 0 && allData.every((d) => d.count === 0),
        [allData]
    );

    const formatDate = useCallback((dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const getDayLabel = useCallback((dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    }, []);

    const rangeLabel = RANGES.find((r) => r.days === activeDays)?.label ?? `${activeDays}d`;
    const summary = `${totalContributions} contribution${totalContributions !== 1 ? 's' : ''} across ${activeCount} active day${activeCount !== 1 ? 's' : ''} in the last ${rangeLabel}.`;

    // Compute cell size based on number of days
    const cellGap = activeDays <= 30 ? 3 : activeDays <= 90 ? 2 : 1;
    const cellRadius = activeDays <= 30 ? '3px' : activeDays <= 90 ? '2px' : '1.5px';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-border bg-surface/40 p-5 md:p-6"
        >
            {/* Header with range toggle */}
            <div className="flex items-center justify-between flex-wrap gap-y-2 mb-4">
                <div className="flex items-center gap-2.5">
                    <GitCommit size={14} className="text-accent" />
                    <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                        GitHub Contributions
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Range toggle pills */}
                    <div
                        role="group"
                        aria-label="Contribution date range"
                        className="flex items-center gap-1 mr-3 bg-surface-light/50 rounded-full p-0.5 border border-border"
                    >
                        {RANGES.map(({ label, days }) => {
                            const selected = activeDays === days;
                            return (
                                <button
                                    key={days}
                                    type="button"
                                    onClick={() => setActiveDays(days)}
                                    aria-pressed={selected}
                                    aria-label={days === 365 ? 'Last year' : `Last ${days} days`}
                                    className={`relative px-2.5 py-2 text-[10px] font-mono rounded-full transition-colors duration-300 cursor-pointer min-h-[36px] ${selected
                                        ? 'text-accent font-semibold'
                                        : 'text-text-dim hover:text-text-muted'
                                        }`}
                                >
                                    {selected && (
                                        <motion.span
                                            layoutId={`graph-range-bg-${pillId}`}
                                            className="absolute inset-0 rounded-full bg-accent/15 border border-accent/40"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-text-dim text-[10px] font-mono hover:text-accent transition-colors duration-200"
                    >
                        @{GITHUB_USERNAME}
                        <ExternalLink size={10} aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* Contribution grid */}
            {loading ? (
                /* Skeleton mirrors the loaded layout (grid + stats row) so nothing
                   shifts when the data lands. */
                <>
                    <span className="sr-only" role="status">
                        Loading GitHub contributions
                    </span>
                    <div aria-hidden="true">
                        <div className="flex flex-wrap" style={{ gap: '3px' }}>
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="shimmer aspect-square bg-surface-light/50 rounded-[3px] border border-border"
                                    style={{
                                        width: `calc((100% - ${(30 - 1) * 3}px) / 30)`,
                                        minWidth: '6px',
                                        maxWidth: '18px',
                                        animationDelay: `${(i % 5) * 120}ms`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <div className="flex items-center gap-4">
                                <div className="shimmer h-4 w-28 rounded bg-surface-light/50" />
                                <span className="w-px h-3 bg-border" />
                                <div className="shimmer h-4 w-20 rounded bg-surface-light/50" />
                            </div>
                            <div className="hidden sm:block shimmer h-3 w-28 rounded bg-surface-light/50" />
                        </div>
                    </div>
                </>
            ) : error || allData.length === 0 ? (
                <div
                    role="alert"
                    className="flex flex-col items-center justify-center gap-3 py-8 text-center"
                >
                    <p className="text-text-muted text-xs font-mono max-w-[18rem] leading-relaxed">
                        Couldn&apos;t load contribution data from GitHub right now.
                    </p>
                    <button
                        type="button"
                        onClick={retry}
                        className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-full border border-accent/40 bg-accent/10 text-accent text-[10px] font-mono uppercase tracking-[0.1em] hover:bg-accent/20 transition-colors duration-200 cursor-pointer"
                    >
                        <RotateCw size={11} aria-hidden="true" />
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Grid of day cells */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDays}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-wrap"
                                style={{ gap: `${cellGap}px` }}
                                /* A 365-cell grid read out one cell at a time is unusable;
                                   the whole grid is announced as a single summary instead. */
                                role="img"
                                aria-label={summary}
                            >
                                {data.map((day) => {
                                    const level = getLevel(day.count, maxCount);
                                    return (
                                        <div
                                            key={day.date}
                                            aria-hidden="true"
                                            title={`${day.count} contribution${day.count !== 1 ? 's' : ''} — ${getDayLabel(day.date)}, ${formatDate(day.date)}`}
                                            onMouseEnter={() => setHoveredDay(day)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            onClick={() => {
                                                clearTimeout(touchTimerRef.current);
                                                if (hoveredDay?.date === day.date) { setHoveredDay(null); return; }
                                                setHoveredDay(day);
                                                touchTimerRef.current = setTimeout(() => setHoveredDay(null), 1500);
                                            }}
                                            className={`aspect-square border cursor-default transition-all duration-200 hover:scale-[1.4] hover:z-10 ${levelColors[level]}`}
                                            style={{
                                                width: `calc((100% - ${(activeDays - 1) * cellGap}px) / ${activeDays})`,
                                                minWidth: activeDays <= 90 ? '6px' : '3px',
                                                maxWidth: activeDays <= 30 ? '18px' : activeDays <= 90 ? '10px' : '6px',
                                                borderRadius: cellRadius,
                                            }}
                                        />
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>

                        {/* Re-announced on range change so the summary stays truthful */}
                        <p className="sr-only" role="status">{summary}</p>

                        {/* Tooltip — clamped to 90vw on narrow screens */}
                        {hoveredDay && (
                            <div
                                aria-hidden="true"
                                className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface border border-border-hover shadow-lg shadow-black/30 whitespace-nowrap z-20 pointer-events-none max-w-[90vw]"
                            >
                                <span className="text-text text-xs font-medium">
                                    {hoveredDay.count} contribution{hoveredDay.count !== 1 ? 's' : ''}
                                </span>
                                <span className="text-text-dim text-xs ml-1.5">
                                    {getDayLabel(hoveredDay.date)}, {formatDate(hoveredDay.date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {neverActive && (
                        <p className="text-text-dim text-[11px] font-mono mt-3">
                            No public contributions recorded in the last year.
                        </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="text-text font-semibold text-sm">{totalContributions}</span>
                                <span className="text-text-dim text-xs ml-1.5">contributions</span>
                            </div>
                            <span className="w-px h-3 bg-border" />
                            <div>
                                <span className="text-text font-semibold text-sm">{activeCount}</span>
                                <span className="text-text-dim text-xs ml-1.5">
                                    active day{activeCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="hidden sm:flex items-center gap-1.5" aria-hidden="true">
                            <span className="text-text-dim text-[10px] font-mono mr-1">Less</span>
                            {[0, 1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`w-[10px] h-[10px] rounded-[2px] border ${levelColors[level]}`}
                                />
                            ))}
                            <span className="text-text-dim text-[10px] font-mono ml-1">More</span>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
