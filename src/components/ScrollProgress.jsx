import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { id: 'hero', label: 'Home', xp: 0 },
    { id: 'skills', label: 'Skills', xp: 20 },
    { id: 'projects', label: 'Work', xp: 45 },
    { id: 'timeline', label: 'Journey', xp: 70 },
    { id: 'contact', label: 'Contact', xp: 100 },
];

export default function ScrollProgress({ activeSection }) {
    const [scrollPercent, setScrollPercent] = useState(0);
    const [milestone, setMilestone] = useState(null);
    const [reached, setReached] = useState(new Set(['hero']));

    useEffect(() => {
        const onScroll = () => {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            setScrollPercent(docH > 0 ? (window.scrollY / docH) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Track milestones
    useEffect(() => {
        if (activeSection && !reached.has(activeSection)) {
            setReached((prev) => new Set([...prev, activeSection]));
            const section = sections.find((s) => s.id === activeSection);
            if (section && section.id !== 'hero') {
                setMilestone(section.label);
                setTimeout(() => setMilestone(null), 2000);
            }
        }
    }, [activeSection]);

    const handleClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const currentXP = Math.round(scrollPercent);

    return (
        <>
            {/* ── Right-side nav dots ── */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const isReached = reached.has(section.id);
                    return (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className="group relative flex items-center"
                            aria-label={`Go to ${section.label}`}
                        >
                            {/* Tooltip */}
                            <span className="absolute right-6 px-2 py-1 rounded-md bg-surface-light text-text text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
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
                                            ? 'rgba(226,160,78,0.4)'
                                            : 'rgba(255,255,255,0.15)',
                                    boxShadow: isActive
                                        ? '0 0 12px rgba(226,160,78,0.5)'
                                        : '0 0 0px transparent',
                                }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            />
                        </button>
                    );
                })}

                {/* XP counter */}
                <div className="mt-2 font-mono text-[10px] text-text-dim tracking-wider">
                    <span className="text-accent">{currentXP}</span>
                    <span className="text-text-dim">%</span>
                </div>
            </div>

            {/* ── Milestone toast ── */}
            <AnimatePresence>
                {milestone && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="fixed bottom-8 left-1/2 z-50 px-5 py-2.5 rounded-full bg-surface/90 backdrop-blur-xl border border-accent/20 shadow-lg shadow-black/30"
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
