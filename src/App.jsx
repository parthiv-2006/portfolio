import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

export default function App() {
    const [showFullSite, setShowFullSite] = useState(false);
    const { activeSection } = useActiveSection();
    const prefersReducedMotion = useReducedMotion();

    const exitTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

    const entryTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

    return (
        <>
            <CursorTrail />
            <AnimatePresence mode="wait">
                {!showFullSite ? (
                    <motion.div
                        key="landing"
                        exit={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.97, y: -16 }
                        }
                        transition={exitTransition}
                    >
                        <LandingSummary onEnter={() => setShowFullSite(true)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="full"
                        initial={
                            prefersReducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 24 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={entryTransition}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
