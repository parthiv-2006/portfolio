import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import SkillsGrid from './components/SkillsGrid';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Terminal from './components/Terminal';
import ContactSection from './components/ContactSection';
import ScrollProgress from './components/ScrollProgress';
import CursorTrail from './components/CursorTrail';
import LandingSummary from './components/LandingSummary';
import Marquee from './components/Marquee';
import GitHubGraph from './components/GitHubGraph';
import GitHubStreak from './components/GitHubStreak';
import SectionHeading from './components/SectionHeading';
import useActiveSection from './hooks/useActiveSection';

function EnteringOverlay({ onDone }) {
    const [curtainsOpen, setCurtainsOpen] = useState(false);
    const [seamVisible, setSeamVisible] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        // Start curtains after content is visible
        const t1 = setTimeout(() => { setCurtainsOpen(true); setSeamVisible(false); }, 550);
        // Notify parent after curtains fully open
        const t2 = setTimeout(onDone, 1700);
        timerRef.current = [t1, t2];
        return () => timerRef.current.forEach(clearTimeout);
    }, [onDone]);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, overflow: 'hidden' }}>
            {/* Left curtain */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '50.5%',
                background: 'var(--color-bg)',
                transition: 'transform 1.05s cubic-bezier(0.76, 0, 0.24, 1)',
                transform: curtainsOpen ? 'translateX(-101%)' : 'translateX(0)',
            }} />
            {/* Right curtain */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, right: 0, width: '50.5%',
                background: 'var(--color-bg)',
                transition: 'transform 1.05s cubic-bezier(0.76, 0, 0.24, 1)',
                transform: curtainsOpen ? 'translateX(101%)' : 'translateX(0)',
            }} />
            {/* Center seam glow */}
            <div style={{
                position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to bottom, transparent, var(--color-accent), transparent)',
                boxShadow: '0 0 22px var(--color-accent)',
                opacity: seamVisible ? 1 : 0,
                transition: 'opacity 0.55s ease',
                pointerEvents: 'none',
            }} />
            {/* Center content */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: 'min(420px, 82vw)' }}
                >
                    {/* P icon with expanding rings */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                        <motion.span
                            animate={{ scale: [0.7, 2.4], opacity: [0.7, 0] }}
                            transition={{ duration: 1.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 0 }}
                            style={{ position: 'absolute', width: '74px', height: '74px', borderRadius: '50%', border: '1px solid var(--color-accent)' }}
                        />
                        <motion.span
                            animate={{ scale: [0.7, 2.4], opacity: [0.7, 0] }}
                            transition={{ duration: 1.6, ease: 'easeOut', repeat: Infinity, delay: 0.8, repeatDelay: 0 }}
                            style={{ position: 'absolute', width: '74px', height: '74px', borderRadius: '50%', border: '1px solid var(--color-accent)' }}
                        />
                        <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: '34px', color: 'var(--color-accent)', lineHeight: 1, position: 'relative', zIndex: 1 }}>P</span>
                    </div>
                    {/* Label */}
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--color-text)', marginBottom: '22px', paddingLeft: '0.42em' }}>
                        Entering Experience
                    </p>
                    {/* Progress bar */}
                    <div style={{ position: 'relative', width: '100%', height: '2px', borderRadius: '2px', background: 'var(--color-surface-light)', overflow: 'hidden', marginBottom: '18px' }}>
                        <motion.span
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.45, ease: [0.55, 0, 0.25, 1] }}
                            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: 'linear-gradient(90deg, var(--color-accent), #f3cf95)', boxShadow: '0 0 12px var(--color-accent)' }}
                        />
                    </div>
                    {/* Log lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--color-text-dim)' }}>
                        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>› initializing canvas field</motion.span>
                        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>› loading shipped work</motion.span>
                        <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.5 }}>› compiling the craft</motion.span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function App() {
    const [showFullSite, setShowFullSite] = useState(false);
    const [showEntering, setShowEntering] = useState(false);
    const { activeSection } = useActiveSection();

    const handleEnter = () => {
        setShowFullSite(true);
        setShowEntering(true);
    };

    return (
        <>
            <CursorTrail />

            {/* Entering overlay — sits above everything during transition */}
            {showEntering && <EnteringOverlay onDone={() => setShowEntering(false)} />}

            {/* Landing summary */}
            {!showFullSite && (
                <LandingSummary onEnter={handleEnter} />
            )}

            {/* Full portfolio site */}
            {showFullSite && (
                        <div className="min-h-screen bg-bg text-text">
                            <Navbar activeSection={activeSection} />
                            <ScrollProgress activeSection={activeSection} />

                            <main>
                                {/* ── Hero ── */}
                                <Hero />

                                {/* ── Marquee ── */}
                                <Marquee />

                                {/* ── About ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
                                    <About />
                                </div>

                                {/* ── Skills ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                                    <SkillsGrid />
                                </div>

                                {/* ── Activity ── */}
                                <section id="activity" className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                                    <SectionHeading label="Activity" title="Always building" subtitle="Live from GitHub. Every cell and bar is a real day of work." />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <GitHubStreak />
                                        <GitHubGraph />
                                    </div>
                                </section>

                                {/* ── Work / Projects ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                                    <Projects />
                                </div>

                                {/* ── Journey / Timeline ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                                    <Timeline />
                                </div>

                                {/* ── Terminal ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                                    <Terminal />
                                </div>

                                {/* ── Contact ── */}
                                <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
                                    <ContactSection />
                                </div>
                            </main>

                            <footer className="border-t border-white/[0.06] py-10 px-6">
                                <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
                                    <span className="text-text-dim text-sm font-mono">
                                        © {new Date().getFullYear()} Parthiv Paul
                                    </span>
                                    <span className="text-text-dim text-xs font-mono">
                                        ↑↑↓↓←→←→ B A · open the console
                                    </span>
                                </div>
                            </footer>
                        </div>
            )}
        </>
    );
}
