import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading';
import Credentials from './Credentials';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { experience as entries } from '../data/experience';

/* Every card has its own in-view trigger, so the stagger only needs to cover
   the first screenful. Past that it is just dead waiting time. */
const MAX_STAGGER_STEPS = 3;

function TimelineEntry({ entry, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const reducedMotion = usePrefersReducedMotion();

    const Icon = entry.icon;
    const isEducation = entry.type === 'education';

    const markerClass = isEducation ? 'bg-bg border-2 border-accent' : 'bg-accent';
    const iconTileClass = isEducation
        ? 'bg-surface2 border border-border-hover'
        : 'bg-accent/10 border border-accent/20';

    return (
        <motion.li
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
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

            {/* Card */}
            <div className="group relative overflow-hidden border border-border rounded-2xl bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/35">
                {/* Warm corner wash on hover — matches the Credentials cards */}
                <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 70% 60% at 100% 0%, var(--color-accent-glow) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                <div className="relative z-[1] flex items-start gap-3.5 mb-3">
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

                <p className="relative z-[1] text-sm text-text-muted leading-relaxed">{entry.description}</p>

                {entry.stack && (
                    <div className="relative z-[1] flex flex-wrap gap-1.5 mt-4">
                        {entry.stack.map((t) => (
                            <span
                                key={t}
                                className="font-mono text-[11px] text-text-muted bg-surface2/60 border border-border px-2 py-0.5 rounded-md"
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

export default function Timeline() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end 60%'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="journey" className="w-full">
            <SectionHeading
                label="Journey"
                title="Experience & education"
                subtitle="Where I've shipped, what I studied, and what came of it."
            />

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
                    {entries.map((entry, i) => (
                        <TimelineEntry key={entry.title} entry={entry} index={i} />
                    ))}
                </ol>
            </div>

            <Credentials />
        </section>
    );
}
