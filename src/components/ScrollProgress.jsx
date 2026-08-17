import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

// Mirrors SECTION_IDS in src/hooks/useActiveSection.js — keep the two in sync,
// otherwise the rail goes dead on whichever section is missing here.
// `milestone` marks the few sections worth a toast. Every section used to
// fire one, which meant eight interruptions per scroll-through.
const sections = [
    { id: 'hero',     label: 'Home' },
    { id: 'about',    label: 'About' },
    { id: 'skills',   label: 'Skills' },
    { id: 'activity', label: 'Activity' },
    { id: 'work',     label: 'Work',     milestone: true },
    { id: 'journey',  label: 'Journey',  milestone: true },
    { id: 'lab',      label: 'Terminal' },
    { id: 'contact',  label: 'Contact',  milestone: true },
];

const BACK_TO_TOP_AFTER = 600;

export default function ScrollProgress({ activeSection }) {
    const [scrollPercent, setScrollPercent] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [milestone, setMilestone] = useState(null);
    const [reached, setReached] = useState(new Set(['hero']));
    const milestoneTimer = useRef(null);
    const reducedMotion = usePrefersReducedMotion();

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 26,
        restDelta: 0.001,
    });
    // The spring smooths trackpad/wheel jitter; when the user asks for less
    // motion the bar tracks the raw scroll position instead of easing into it.
    const progressScaleX = reducedMotion ? scrollYProgress : smoothProgress;

    useEffect(() => {
        let frame = null;
        const read = () => {
            frame = null;
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            setScrollPercent(docH > 0 ? (window.scrollY / docH) * 100 : 0);
            setShowBackToTop(window.scrollY > BACK_TO_TOP_AFTER);
        };
        // Coalesce bursts of scroll events into one state write per frame.
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(read);
        };
        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    // Track milestones
    useEffect(() => {
        if (!activeSection || reached.has(activeSection)) return;
        setReached((prev) => new Set([...prev, activeSection]));

        const section = sections.find((s) => s.id === activeSection);
        if (!section?.milestone) return;
        setMilestone(section.label);
        clearTimeout(milestoneTimer.current);
        milestoneTimer.current = setTimeout(() => setMilestone(null), 2000);
    }, [activeSection, reached]);

    useEffect(() => () => clearTimeout(milestoneTimer.current), []);

    const scrollBehavior = reducedMotion ? 'auto' : 'smooth';

    const handleClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
    };

    const currentXP = Math.round(scrollPercent);

    return (
        <>
            {/* ── Top progress bar (sits above the nav) ── */}
            <motion.div
                aria-hidden="true"
                style={{ scaleX: progressScaleX }}
                className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-accent"
            />

            {/* ── Right-side nav dots ── */}
            <nav
                aria-label="Section navigation"
                className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
            >
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const isReached = reached.has(section.id);
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className="group relative flex items-center"
                            aria-label={`Go to ${section.label}`}
                            aria-current={isActive ? 'true' : undefined}
                        >
                            {/* Tooltip — shown for pointer hover and keyboard focus alike */}
                            <span className="absolute right-6 px-2 py-1 rounded-md bg-surface-light text-text text-xs font-mono opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                {section.label}
                                {isReached && <span className="text-accent ml-1">✓</span>}
                            </span>

                            {/* Dot */}
                            <motion.div
                                className="rounded-full transition-colors duration-300"
                                animate={{
                                    width: isActive ? 10 : 6,
                                    height: isActive ? 10 : 6,
                                    backgroundColor: isActive
                                        ? 'var(--color-accent)'
                                        : isReached
                                            ? 'var(--color-accent-dim)'
                                            : 'var(--color-border-hover)',
                                    boxShadow: isActive
                                        ? '0 0 12px var(--color-accent-dim)'
                                        : '0 0 0px transparent',
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                        </button>
                    );
                })}

                {/* XP counter */}
                <div className="mt-2 font-mono text-[10px] text-text-dim tracking-wider" aria-hidden="true">
                    <span className="text-accent">{currentXP}</span>
                    <span className="text-text-dim">%</span>
                </div>
            </nav>

            {/* ── Back to top ── */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        key="back-to-top"
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed z-40 w-11 h-11 flex items-center justify-center rounded-full border border-border bg-surface/80 backdrop-blur-xl text-text-muted shadow-lg shadow-black/20 cursor-pointer transition-colors duration-300 hover:border-accent hover:text-accent"
                        style={{
                            right: 'max(1rem, env(safe-area-inset-right))',
                            bottom: 'max(1rem, env(safe-area-inset-bottom))',
                        }}
                    >
                        <ArrowUp size={16} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Milestone toast ── */}
            <AnimatePresence>
                {milestone && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="fixed bottom-8 left-1/2 z-50 px-5 py-2.5 rounded-full bg-surface/90 backdrop-blur-xl border border-accent/20 shadow-lg shadow-black/30 max-w-[90vw]"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="font-mono text-xs text-text-dim">
                            Section unlocked:{' '}
                            <span className="text-accent font-medium">{milestone}</span>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
