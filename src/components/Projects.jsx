import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const projects = [
    {
        id: 'anima',
        title: 'Anima',
        tagline: 'Gamified Habit Tracking',
        description:
            'A full-stack gamified habit-tracking application that decouples frontend logic using a Monorepo architecture and leverages Zustand for complex game loops. Features fluid, 60fps animations designed with Framer Motion and Lottie to increase user retention.',
        tech: ['React', 'Vite', 'Zustand', 'Framer Motion', 'MongoDB'],
        year: '2025',
        role: 'Full-Stack',
        image: '/projects/anima.png',
        github: 'https://github.com/parthiv-2006/Anima',
        live: 'https://anima-client.vercel.app/'
    },
    {
        id: 'macromatch',
        title: 'MacroMatch',
        tagline: 'Intelligent Nutrition Platform',
        description:
            'A nutrition platform that optimizes meal generation logic using the Simplex Algorithm (Linear Programming) to solve macronutrient constraint systems in under 200ms. Features a robust CI/CD pipeline via Vercel/Render and JWT-based session management.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB'],
        year: '2025',
        role: 'Full-Stack',
        image: '/projects/macromatch.png',
        github: 'https://github.com/parthiv-2006/MacroMatch',
        live: 'https://macro-match-cyan.vercel.app/'
    },
    {
        id: 'palate',
        title: 'Palate',
        tagline: 'AI Restaurant Recommender',
        description:
            'A web app that mitigates credential vulnerabilities by implementing passkey-first authentication using WebAuthn. Synchronizes real-time lobby states for concurrent users by leveraging Next.js Server Actions and optimistic UI updates. Integrates Google Gemini AI to analyze user behavior patterns and generate personalized recommendations.',
        tech: ['Next.js', 'TypeScript', 'MongoDB', 'Gemini AI', 'WebAuthn'],
        year: '2026',
        role: 'Full-Stack',
        image: '/projects/uofthacks.png',
        github: 'https://github.com/parthiv-2006/palate',
        live: 'https://www.mypalate.tech/'
    },
];

/* ── Derive unique tech tags from all projects ── */
const allTechs = [...new Set(projects.flatMap((p) => p.tech))].sort();

/* ── Slide animation variants (direction-aware) ── */
const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.96,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        scale: 0.96,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

/* ── Filter pill animation ── */
const pillVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const AUTO_CYCLE_MS = 5000;

export default function Projects() {
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    /* ── Filtered project list ── */
    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((p) => p.tech.includes(activeFilter));
    }, [activeFilter]);

    /* ── Reset to slide 0 when filter changes ── */
    useEffect(() => {
        setDirection(1);
        setCurrentIndex(0);
    }, [activeFilter]);

    /* ── Navigation helpers ── */
    const goTo = useCallback(
        (idx) => {
            setDirection(idx > currentIndex ? 1 : -1);
            setCurrentIndex(idx);
        },
        [currentIndex],
    );

    const goNext = useCallback(() => {
        if (filtered.length <= 1) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % filtered.length);
    }, [filtered.length]);

    const goPrev = useCallback(() => {
        if (filtered.length <= 1) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    }, [filtered.length]);

    /* ── Auto-cycle timer ── */
    useEffect(() => {
        if (isPaused || filtered.length <= 1) {
            clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(goNext, AUTO_CYCLE_MS);
        return () => clearInterval(intervalRef.current);
    }, [isPaused, goNext, filtered.length]);

    /* ── Clamp index if filter shortens the list ── */
    useEffect(() => {
        if (currentIndex >= filtered.length) {
            setCurrentIndex(0);
        }
    }, [filtered.length, currentIndex]);

    const currentProject = filtered[currentIndex];

    return (
        <section id="projects" className="w-full">
            <div className="w-full">
                <SectionHeading label="Work" title="Featured Projects" />

                {/* ── Filter pills ── */}
                <div className="mb-8 -mt-2">
                    <div className="flex gap-2 flex-wrap">
                        <motion.button
                            custom={0}
                            variants={pillVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            onClick={() => setActiveFilter('All')}
                            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer ${activeFilter === 'All'
                                ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(226,160,78,0.15)]'
                                : 'bg-surface/40 text-text-dim border-white/[0.06] hover:border-white/[0.15] hover:text-text-muted'
                                }`}
                        >
                            All
                        </motion.button>

                        {allTechs.map((tech, i) => (
                            <motion.button
                                key={tech}
                                custom={i + 1}
                                variants={pillVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                onClick={() => setActiveFilter(tech)}
                                className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer ${activeFilter === tech
                                    ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(226,160,78,0.15)]'
                                    : 'bg-surface/40 text-text-dim border-white/[0.06] hover:border-white/[0.15] hover:text-text-muted'
                                    }`}
                            >
                                {tech}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* ── Carousel ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-text-dim font-mono text-sm">
                        No projects match this filter.
                    </div>
                ) : (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Chevron buttons */}
                        {filtered.length > 1 && (
                            <>
                                <button
                                    onClick={goPrev}
                                    aria-label="Previous project"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 p-2 rounded-full bg-surface/80 border border-white/[0.06] text-text-dim hover:text-accent hover:border-accent/30 transition-all duration-300 backdrop-blur-sm cursor-pointer hidden md:flex items-center justify-center"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={goNext}
                                    aria-label="Next project"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 p-2 rounded-full bg-surface/80 border border-white/[0.06] text-text-dim hover:text-accent hover:border-accent/30 transition-all duration-300 backdrop-blur-sm cursor-pointer hidden md:flex items-center justify-center"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}

                        {/* Slide area */}
                        <div className="overflow-hidden rounded-xl">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={currentProject.id + '-' + currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    onClick={() => setSelected(currentProject)}
                                    className="group relative rounded-xl border border-white/[0.06] bg-surface/40 overflow-hidden cursor-pointer transition-colors duration-400 hover:border-accent/30 hover:bg-surface"
                                >
                                    <div className="flex flex-col md:flex-row min-h-[280px]">
                                        {/* Left panel: project info */}
                                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
                                            {/* Number + year badge */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="font-mono text-accent text-xs tracking-widest">
                                                    {String(currentIndex + 1).padStart(2, '0')}
                                                </span>
                                                <span className="w-8 h-px bg-accent/30" />
                                                <span className="font-mono text-text-dim text-xs">
                                                    {currentProject.year}
                                                </span>
                                            </div>

                                            {/* Title + tagline */}
                                            <h3 className="text-2xl md:text-3xl font-bold text-text tracking-tight group-hover:text-accent transition-colors duration-300 mb-1">
                                                {currentProject.title}
                                            </h3>
                                            <p className="text-text-muted text-sm mb-4">
                                                {currentProject.tagline}
                                            </p>

                                            {/* Description excerpt */}
                                            <p className="text-text-dim text-sm leading-relaxed mb-5 line-clamp-2 max-w-md">
                                                {currentProject.description}
                                            </p>

                                            {/* Tech stack pills */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {currentProject.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className={`px-2.5 py-1 text-[11px] rounded-md font-mono border transition-colors duration-300 ${activeFilter === t
                                                            ? 'bg-accent/15 text-accent border-accent/25'
                                                            : 'bg-surface-light/60 text-text-dim border-white/[0.04] group-hover:text-text-muted group-hover:border-white/[0.08]'
                                                            }`}
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* View project prompt */}
                                            <div className="flex items-center gap-2 text-text-dim text-xs font-mono group-hover:text-accent transition-colors duration-300">
                                                <span>View project</span>
                                                <ArrowUpRight
                                                    size={14}
                                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                />
                                            </div>
                                        </div>

                                        {/* Right panel: project image with diagonal mask */}
                                        <div className="relative w-full md:w-[45%] min-h-[200px] md:min-h-0 shrink-0 hidden md:block">
                                            <div
                                                className="absolute inset-0 overflow-hidden"
                                                style={{
                                                    clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
                                                }}
                                            >
                                                <img
                                                    src={currentProject.image}
                                                    alt={currentProject.title}
                                                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                                {/* Gradient overlays for blending */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 to-transparent" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-surface/30" />
                                            </div>
                                        </div>

                                        {/* Mobile: full-width image at bottom */}
                                        <div className="md:hidden relative w-full h-[180px] overflow-hidden">
                                            <img
                                                src={currentProject.image}
                                                alt={currentProject.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                                        </div>
                                    </div>

                                    {/* Bottom border accent on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Subtle glow effect on hover */}
                                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Subtle progress bar for auto-cycle */}
                                    {!isPaused && filtered.length > 1 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden z-10">
                                            <motion.div
                                                key={currentProject.id + '-progress'}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{
                                                    duration: AUTO_CYCLE_MS / 1000,
                                                    ease: 'linear',
                                                }}
                                                className="h-full bg-gradient-to-r from-accent/50 to-accent/20 origin-left"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dot indicators */}
                        {filtered.length > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {filtered.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        aria-label={`Go to project ${i + 1}`}
                                        className="group/dot p-1 cursor-pointer"
                                    >
                                        <span
                                            className={`block rounded-full transition-all duration-400 ${i === currentIndex
                                                ? 'w-6 h-2 bg-accent shadow-[0_0_8px_rgba(226,160,78,0.3)]'
                                                : 'w-2 h-2 bg-text-dim/40 group-hover/dot:bg-text-dim'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Expanded detail modal */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40"
                            >
                                {/* Project image */}
                                <div className="w-full h-48 overflow-hidden">
                                    <img
                                        src={selected.image}
                                        alt={selected.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                                </div>

                                {/* Header overlaid on gradient */}
                                <div className="px-6 -mt-12 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-mono text-accent text-xs tracking-wide mb-2">
                                                {selected.role} · {selected.year}
                                            </p>
                                            <h3 className="text-2xl font-bold tracking-tight text-text">
                                                {selected.title}
                                            </h3>
                                            <p className="text-text-muted text-sm mt-1">
                                                {selected.tagline}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="p-2 rounded-lg text-text-dim hover:text-text hover:bg-surface-light transition-colors"
                                            aria-label="Close"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="mx-6 my-5 h-px bg-white/[0.06]" />

                                {/* Body */}
                                <div className="px-6 pb-6">
                                    <p className="text-text-muted text-sm leading-relaxed mb-6">
                                        {selected.description}
                                    </p>

                                    <h4 className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-3">
                                        Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {selected.tech.map((t) => (
                                            <span
                                                key={t}
                                                className="px-3 py-1.5 text-xs rounded-lg bg-surface-light text-text-muted font-mono border border-white/[0.06]"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        {selected.github && (
                                            <a
                                                href={selected.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium border border-accent/20 hover:bg-accent/20 transition-colors"
                                            >
                                                <Github size={15} /> Source
                                            </a>
                                        )}
                                        {selected.live && (
                                            <a
                                                href={selected.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light text-text-muted text-sm font-medium border border-white/[0.06] hover:border-white/[0.15] hover:text-text transition-colors"
                                            >
                                                <ExternalLink size={15} /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
