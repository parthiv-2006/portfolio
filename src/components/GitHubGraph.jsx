import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, ExternalLink } from 'lucide-react';

const GITHUB_USERNAME = 'parthiv-2006';

const RANGES = [
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
    { label: '1y', days: 365 },
];

/**
 * Fetches contribution graph data from a public proxy.
 * This provides the full 365 days of activity instead of hitting the 300-event limit.
 */
async function fetchContributions(username) {
    try {
        const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (!response.ok) return [];

        const data = await response.json();

        // The API returns a 2D array of weeks/days. Flatten it to a 1D array.
        const flatData = data.contributions.flat();

        // Map to our expected format
        return flatData
            .map((day) => ({
                date: day.date,
                count: day.contributionCount,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
        return [];
    }
}

/** Determine which range has the highest contribution density */
function findBestRange(allData) {
    const now = new Date();
    let bestIdx = 0;
    let bestDensity = 0;

    for (let i = 0; i < RANGES.length; i++) {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - RANGES[i].days);
        const cutoffStr = cutoff.toISOString().slice(0, 10);

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
    0: 'bg-surface-light/40 border-white/[0.03]',
    1: 'bg-accent/15 border-accent/10',
    2: 'bg-accent/30 border-accent/20',
    3: 'bg-accent/50 border-accent/30',
    4: 'bg-accent/75 border-accent/40 shadow-[0_0_6px_rgba(226,160,78,0.2)]',
};

export default function GitHubGraph() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDays, setActiveDays] = useState(30);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [hasAutoSelected, setHasAutoSelected] = useState(false);

    useEffect(() => {
        fetchContributions(GITHUB_USERNAME).then((d) => {
            setAllData(d);
            setLoading(false);
        });
    }, []);

    // Auto-select the best range once data loads
    useEffect(() => {
        if (!loading && allData.length > 0 && !hasAutoSelected) {
            const best = findBestRange(allData);
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

    const formatDate = useCallback((dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const getDayLabel = useCallback((dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    }, []);

    // Compute cell size based on number of days
    const cellGap = activeDays <= 30 ? 3 : activeDays <= 90 ? 2 : 1;
    const cellRadius = activeDays <= 30 ? '3px' : activeDays <= 90 ? '2px' : '1.5px';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-xl border border-white/[0.06] bg-surface/40 p-5 md:p-6"
        >
            {/* Header with range toggle */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <GitCommit size={14} className="text-accent" />
                    <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
                        Activity
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Range toggle pills */}
                    <div className="flex items-center gap-1 mr-3 bg-surface-light/50 rounded-full p-0.5 border border-white/[0.04]">
                        {RANGES.map(({ label, days }) => (
                            <button
                                key={days}
                                onClick={() => setActiveDays(days)}
                                className={`relative px-2.5 py-1 text-[10px] font-mono rounded-full transition-all duration-300 cursor-pointer ${activeDays === days
                                    ? 'text-accent'
                                    : 'text-text-dim hover:text-text-muted'
                                    }`}
                            >
                                {activeDays === days && (
                                    <motion.span
                                        layoutId="graph-range-bg"
                                        className="absolute inset-0 rounded-full bg-accent/15 border border-accent/20"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{label}</span>
                            </button>
                        ))}
                    </div>

                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-text-dim text-[10px] font-mono hover:text-accent transition-colors duration-200"
                    >
                        @{GITHUB_USERNAME}
                        <ExternalLink size={10} />
                    </a>
                </div>
            </div>

            {/* Contribution grid */}
            {loading ? (
                <div className="flex gap-1 justify-center py-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-sm bg-surface-light/40 animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                        />
                    ))}
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
                            >
                                {data.map((day, i) => {
                                    const level = getLevel(day.count, maxCount);
                                    return (
                                        <div
                                            key={day.date}
                                            onMouseEnter={() => setHoveredDay(day)}
                                            onMouseLeave={() => setHoveredDay(null)}
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

                        {/* Tooltip */}
                        {hoveredDay && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface border border-white/[0.08] shadow-lg shadow-black/30 whitespace-nowrap z-20 pointer-events-none">
                                <span className="text-text text-xs font-medium">
                                    {hoveredDay.count} contribution{hoveredDay.count !== 1 ? 's' : ''}
                                </span>
                                <span className="text-text-dim text-xs ml-1.5">
                                    {getDayLabel(hoveredDay.date)}, {formatDate(hoveredDay.date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="text-text font-semibold text-sm">{totalContributions}</span>
                                <span className="text-text-dim text-xs ml-1.5">contributions</span>
                            </div>
                            <span className="w-px h-3 bg-white/[0.06]" />
                            <div>
                                <span className="text-text font-semibold text-sm">{activeCount}</span>
                                <span className="text-text-dim text-xs ml-1.5">
                                    active day{activeCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="hidden sm:flex items-center gap-1.5">
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
