import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading';
import Credentials from './Credentials';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { experience as entries } from '../data/experience';

/* Every card has its own in-view trigger, so the stagger only needs to cover
   the first screenful. Past that it is just dead waiting time. */
const MAX_STAGGER_STEPS = 3;

const GROUPS = [
    { key: 'work', label: 'Work & Industry' },
    { key: 'leadership', label: 'Campus Leadership' },
    { key: 'education', label: 'Education' },
];

function TimelineEntry({ entry, index, activeSkill }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const reducedMotion = usePrefersReducedMotion();

    const Icon = entry.icon;
    const isEducation = entry.type === 'education';
    const isMatch = !activeSkill || entry.skills?.includes(activeSkill);

    const markerClass = isEducation ? 'bg-bg border-2 border-accent' : 'bg-accent';
    const iconTileClass = isEducation
        ? 'bg-surface2 border border-border-hover'
        : 'bg-accent/10 border border-accent/20';

    return (
        <motion.li
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: isMatch ? 1 : 0.35, x: 0 } : {}}
            transition={{
                duration: 0.5,
                delay: Math.min(index, MAX_STAGGER_STEPS) * 0.08,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
        >
            {/* Marker — education reads as a hollow ring, roles as a filled dot */}
            <span
                className={'absolute left-[-38px] top-[6px] w-3 h-3 rounded-full ring-4 ring-bg shadow-[0_0_14px_var(--color-accent-dim)] ' + markerClass}
                aria-hidden="true"
            />
            {entry.current && !reducedMotion && (
                <span
                    className="absolute left-[-44px] top-0 w-6 h-6 rounded-full border border-accent pointer-events-none"
                    style={{ animation: 'ring-pulse 2.6s ease-out infinite' }}
                    aria-hidden="true"
                />
            )}

            {/* Card — the header block anchors it on its own when there's no
                description/stack yet, so a bare entry never looks unfinished. */}
            <div
                className={`group relative overflow-hidden border rounded-2xl bg-surface p-5 transition-all duration-300 hover:-translate-y-1 ${
                    isMatch && activeSkill
                        ? 'border-accent/60 shadow-[0_0_0_1px_var(--color-accent)]'
                        : 'border-border hover:border-accent/35'
                }`}
            >
                {/* Warm corner wash on hover — matches the Credentials cards */}
                <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 60% at 100% 0%, var(--color-accent-glow) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                <div
                    className={`relative z-[1] flex items-start gap-3.5 ${
                        entry.description || entry.stack ? 'mb-3' : ''
                    }`}
                >
                    <span
                        className={'flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ' + iconTileClass}
                        aria-hidden="true"
                    >
                        <Icon size={16} className={isEducation ? 'text-text-muted' : 'text-accent'} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[17px] font-semibold text-text leading-snug">{entry.title}</h3>
                            {entry.current && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full">
                                    Current
                                </span>
                            )}
                            {isEducation && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted bg-surface2 border border-border-hover px-2 py-0.5 rounded-full">
                                    Education
                                </span>
                            )}
                        </div>

                        <p className="text-[13.5px] text-accent mt-0.5">{entry.subtitle}</p>

                        <p className="font-mono text-[11px] text-text-dim mt-1.5">
                            {entry.date}
                            {entry.location && (
                                <>
                                    <span aria-hidden="true"> · </span>
                                    {entry.location}
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {entry.description && (
                    <p className="relative z-[1] text-sm text-text-muted leading-relaxed">{entry.description}</p>
                )}

                {entry.stack && (
                    <div className="relative z-[1] flex flex-wrap gap-1.5 mt-4">
                        {entry.stack.map((t) => (
                            <span
                                key={t}
                                className={`font-mono text-[11px] px-2 py-0.5 rounded-md border transition-colors duration-300 ${
                                    isMatch && activeSkill
                                        ? 'text-accent bg-accent/10 border-accent/40'
                                        : 'text-text-muted bg-surface2/60 border-border'
                                }`}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.li>
    );
}

/* One vertical, scroll-linked timeline for a single group of entries —
   reused for Work, Campus Leadership, and Education so each fills in
   independently as the reader scrolls through it. */
function TimelineGroup({ label, groupEntries, activeSkill }) {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end 60%'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    if (groupEntries.length === 0) return null;

    return (
        <div>
            <p className="font-mono text-xs tracking-[0.28em] uppercase text-accent mb-5">{label}</p>
            <div ref={containerRef} className="relative pl-[38px]">
                {/* Background line */}
                <div className="absolute left-[5px] top-[6px] bottom-[6px] w-0.5 bg-border" aria-hidden="true" />

                {/* Accent fill line */}
                <motion.div
                    className="absolute left-[5px] top-[6px] w-0.5 bg-accent origin-top shadow-[0_0_10px_var(--color-accent-glow)]"
                    style={{ height: lineHeight }}
                    aria-hidden="true"
                />

                {/* role="list" restores the semantics browsers drop once markers are removed */}
                <ol role="list" className="flex flex-col gap-[30px] list-none">
                    {groupEntries.map((entry, i) => (
                        <TimelineEntry key={entry.title} entry={entry} index={i} activeSkill={activeSkill} />
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default function Timeline({ activeSkill = null, onClearSkill = () => {} } = {}) {
    const matchCount = activeSkill ? entries.filter((e) => e.skills?.includes(activeSkill)).length : entries.length;

    // Escape clears the filter from anywhere on the page, not just while
    // focus happens to sit inside this section.
    useEffect(() => {
        if (!activeSkill) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClearSkill();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [activeSkill, onClearSkill]);

    return (
        <section id="journey" className="w-full">
            <SectionHeading
                label="Journey"
                title="Experience & education"
                subtitle="Where I've shipped, what I've led, and what I studied."
            />

            {/* Announces filter changes to screen readers — the visible bar below
                isn't itself live, so this sr-only twin carries the update. */}
            <p role="status" aria-live="polite" className="sr-only">
                {activeSkill
                    ? `Journey filtered by ${activeSkill} — ${matchCount} of ${entries.length} entries match.`
                    : ''}
            </p>

            {activeSkill && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 font-mono text-[11px] tracking-[0.08em] uppercase text-text-dim">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>
                        Filtered by <span className="text-accent normal-case">{activeSkill}</span> · {matchCount} of {entries.length}
                    </span>
                    <button
                        type="button"
                        onClick={onClearSkill}
                        className="ml-1 text-text-dim hover:text-accent underline underline-offset-2 normal-case tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                        clear <span className="sr-only">skill filter (Escape)</span>
                    </button>
                </div>
            )}

            {activeSkill && matchCount === 0 ? (
                <p className="text-sm text-text-muted border border-border rounded-2xl bg-surface p-5">
                    Nothing shipped with {activeSkill} yet — check back soon.
                </p>
            ) : (
                <div className="flex flex-col gap-12">
                    {GROUPS.map(({ key, label }) => (
                        <TimelineGroup
                            key={key}
                            label={label}
                            groupEntries={entries.filter((e) => e.section === key)}
                            activeSkill={activeSkill}
                        />
                    ))}
                </div>
            )}

            <Credentials />
        </section>
    );
}
