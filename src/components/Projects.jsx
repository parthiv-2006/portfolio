import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, useInView } from 'framer-motion';
import { ExternalLink, Github, X, ArrowUpRight, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import GistDemoWrapper from './GistDemo/index';
import { CircularGallery } from './CircularGallery';

const projects = [
    {
        id: 'leaseguard',
        title: 'LeaseGuard',
        tagline: 'AI Legal Agent for Ontario Tenants',
        description:
            'An AI agent that reads Ontario residential lease PDFs and produces a grounded risk analysis backed by real statute and tribunal text — not training-data hallucinations. A custom MCP server exposes 12 tools to a Claude AI orchestrator: parse the PDF, retrieve matching RTA sections via pgvector RAG, score clause risk deterministically, detect cross-clause contradictions, benchmark against real leases in the corpus, and generate negotiation guidance. Every legal claim is traceable to a retrieved source.',
        tech: ['Next.js', 'TypeScript', 'Claude AI', 'Supabase', 'Python', 'Gemini AI'],
        year: '2026',
        role: 'AI Agent',
        github: 'https://github.com/parthiv-2006/lease-guard',
        live: 'https://leaseguard-sigma.vercel.app/',
    },
    {
        id: 'gist',
        title: 'Gist',
        tagline: 'AI-Powered Knowledge Capture',
        description:
            'A Chrome extension that transforms how you retain information online. Highlight any text on any webpage for an instant AI-powered explanation, summary, or simplification — then save it to a searchable personal library. Synapse, its knowledge graph view, uses semantic embeddings and D3-style pan/zoom to visualise how your saved ideas connect across domains.',
        tech: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'Gemini AI', 'SSE', 'Manifest V3'],
        year: '2026',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/Gist',
        live: null,
        hasDemo: true,
    },
    {
        id: 'reflecta',
        title: 'Reflecta',
        tagline: 'Self-Improving Test Coverage Agent',
        description:
            'An autonomous CLI agent that finds untested Python code and writes targeted pytest tests for it — then proves they work. Reflecta parses coverage.json to surface uncovered functions, generates full test files with Gemini Flash, executes them in an isolated subprocess, and uses Groq (Llama 3.1 8B → 3.3 70B escalation) to repair failures. Every kept test must clear two gates: an AST-level assertion check and a strict coverage-delta gate — tests that pass but add no coverage are discarded.',
        tech: ['Python', 'pytest', 'Gemini AI', 'Groq', 'coverage.py', 'Typer'],
        year: '2026',
        role: 'Dev Tool',
        github: 'https://github.com/parthiv-2006/Reflecta-Ai-Agent',
        wip: true,
    },
    {
        id: 'anima',
        title: 'Anima',
        tagline: 'Gamified Habit Tracking',
        description:
            '"Your Tamagotchi for Productivity." Anima transforms daily routines into an engaging journey by turning habit tracking into a game. Instead of just checking boxes, users build consistency by caring for a virtual pet that evolves and grows based on their real-world productivity.',
        tech: ['React', 'Vite', 'Zustand', 'Framer Motion', 'MongoDB'],
        year: '2025',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/Anima',
        live: 'https://anima-client.vercel.app/'
    },
    {
        id: 'macromatch',
        title: 'MacroMatch',
        tagline: 'Intelligent Nutrition Platform',
        description:
            'A full-stack MERN application that solves meal planning using the Simplex Algorithm (Linear Programming) to satisfy macronutrient constraint systems in under 200ms. Combines smart pantry inventory tracking with a REST API (JWT auth) deployed via CI/CD, supporting 10,000+ daily meal permutations per user alongside an analytics dashboard for nutrition trends.',
        tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Linear Programming'],
        year: '2025',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/MacroMatch',
        live: 'https://macro-match-cyan.vercel.app/'
    },
    {
        id: 'palate',
        title: 'Palate',
        tagline: 'AI Restaurant Recommender',
        description:
            'An AI-powered social dining app built for UofTHacks 2026 to eliminate the friction of group restaurant decisions. Combining behavioral analytics with Google Gemini AI, Palate acts as an impartial mediator that provides hyper-personalized recommendations, all secured seamlessly via passkey-first authentication.',
        tech: ['Next.js', 'TypeScript', 'MongoDB', 'Gemini AI', 'WebAuthn'],
        year: '2026',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/palate',
        live: 'https://palate-self.vercel.app/',
        devpost: 'https://devpost.com/software/palate-3uic5p',
    },
];

const galleryItems = [
    { id: 'leaseguard', title: 'LeaseGuard', tagline: 'AI Legal Agent for Ontario Tenants', image: '', github: 'https://github.com/parthiv-2006/lease-guard', live: 'https://leaseguard-sigma.vercel.app/' },
    { id: 'gist', title: 'Gist', tagline: 'AI-Powered Knowledge Capture', image: '', github: 'https://github.com/parthiv-2006/Gist', live: null },
    { id: 'reflecta', title: 'Reflecta', tagline: 'Self-Improving Test Coverage Agent', image: '', github: 'https://github.com/parthiv-2006/Reflecta-Ai-Agent', live: null },
    { id: 'anima', title: 'Anima', tagline: 'Gamified Habit Tracking', image: '', github: 'https://github.com/parthiv-2006/Anima', live: 'https://anima-client.vercel.app/' },
    { id: 'macromatch', title: 'MacroMatch', tagline: 'Intelligent Nutrition Platform', image: '', github: 'https://github.com/parthiv-2006/MacroMatch', live: 'https://macro-match-cyan.vercel.app/' },
    { id: 'palate', title: 'Palate', tagline: 'AI Restaurant Recommender', image: '', github: 'https://github.com/parthiv-2006/palate', live: 'https://palate-self.vercel.app/' },
];

const allTechs = [...new Set(projects.flatMap((p) => p.tech))].sort();

const pillVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] },
    }),
};

function ProjectCard({ project, activeFilter, onClick, indexInFiltered, activeIndex }) {
    const globalIndex = projects.findIndex((p) => p.id === project.id);
    const offset = indexInFiltered - activeIndex;
    const absOffset = Math.min(Math.abs(offset), 2);

    // 3D depth values: active card pops forward, others recede and angle away
    const rotateY = Math.sign(offset) * absOffset * 12;
    const z = absOffset === 0 ? 50 : absOffset === 1 ? -15 : -30;
    const scale3d = absOffset === 0 ? 1.04 : absOffset === 1 ? 0.96 : 0.92;
    const cardOpacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.6;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY, z }}
            animate={{ opacity: cardOpacity, scale: scale3d, rotateY, z }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
                opacity: { duration: 0.25 },
                scale: { type: 'spring', stiffness: 200, damping: 25 },
                rotateY: { type: 'spring', stiffness: 200, damping: 25 },
                z: { type: 'spring', stiffness: 200, damping: 25 },
            }}
            whileHover={{
                y: -6,
                boxShadow: '0 0 30px rgba(226,160,78,0.15)',
                transition: { type: 'spring', stiffness: 300, damping: 20 },
            }}
            onClick={onClick}
            className="group relative flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[390px] rounded-2xl border border-white/6 bg-surface/40 overflow-hidden cursor-pointer hover:border-accent/25 hover:bg-surface transition-colors duration-300 flex flex-col"
            style={{ minHeight: '340px' }}
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                    <span className="font-mono text-accent text-xs tracking-widest">
                        {String(globalIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="w-6 h-px bg-accent/30" />
                    <span className="font-mono text-text-dim text-xs">{project.year}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-surface text-text-dim border border-white/[0.08]">
                        {project.role}
                    </span>
                    {project.hasDemo && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            Live Demo
                        </span>
                    )}
                    {project.wip && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            In Development
                        </span>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-text tracking-tight group-hover:text-accent transition-colors duration-300 mb-1.5">
                    {project.title}
                </h3>
                <p className="text-text-muted text-sm mb-5 font-medium leading-snug">
                    {project.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.slice(0, 5).map((t) => (
                        <span
                            key={t}
                            className={`px-2.5 py-1 text-xs rounded-lg font-mono border transition-colors duration-300 ${
                                activeFilter === t
                                    ? 'bg-accent/15 text-accent border-accent/25'
                                    : 'bg-surface-light/50 text-text-muted border-white/8 group-hover:border-white/15'
                            }`}
                        >
                            {t}
                        </span>
                    ))}
                    {project.tech.length > 5 && (
                        <span className="px-2.5 py-1 text-xs rounded-lg font-mono border border-white/8 bg-surface-light/50 text-text-dim">
                            +{project.tech.length - 5}
                        </span>
                    )}
                </div>

                <div className="flex items-center flex-wrap gap-2 mt-auto">
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-text-muted text-xs font-mono border border-white/6 hover:border-white/20 hover:text-text transition-all duration-200"
                        >
                            <Github size={13} /> Source
                        </a>
                    )}
                    {project.hasDemo && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onClick(); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-mono border border-accent/20 hover:bg-accent/20 transition-all duration-200 cursor-pointer"
                        >
                            <ExternalLink size={13} /> Live Demo
                        </button>
                    )}
                    {project.live && !project.hasDemo && (
                        <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-mono border border-accent/20 hover:bg-accent/20 transition-all duration-200"
                        >
                            <ExternalLink size={13} /> Live
                        </a>
                    )}
                    {project.devpost && (
                        <a
                            href={project.devpost}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-text-muted text-xs font-mono border border-white/6 hover:border-white/20 hover:text-text transition-all duration-200"
                        >
                            <Video size={13} /> Devpost
                        </a>
                    )}
                    <div className="ml-auto flex items-center gap-1 text-text-dim text-xs font-mono group-hover:text-accent transition-colors duration-300">
                        <span>{project.hasDemo ? 'Demo' : 'Details'}</span>
                        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

export default function Projects() {
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeIndex, setActiveIndex] = useState(0);
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });

    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const stepRef = useRef(414);
    const autoScrollRef = useRef(null);
    const isHovering = useRef(false);
    const x = useMotionValue(0);

    // Stable ref for interval closure — avoids stale captures
    const liveRef = useRef({ activeIndex: 0, filteredLength: 0, goToCard: null });

    const inView = useInView(sectionRef, { once: false, amount: 0.3 });

    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((p) => p.tech.includes(activeFilter));
    }, [activeFilter]);

    // Keep liveRef in sync on every render (cheap assignment)
    liveRef.current.activeIndex = activeIndex;
    liveRef.current.filteredLength = filtered.length;

    const isDemo = selected?.hasDemo;

    useEffect(() => {
        if (isDemo && selected) {
            document.body.dataset.demoOpen = 'true';
        } else {
            delete document.body.dataset.demoOpen;
        }
        return () => { delete document.body.dataset.demoOpen; };
    }, [isDemo, selected]);

    const measureLayout = useCallback(() => {
        if (!containerRef.current || !trackRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setConstraints({ left: -Math.max(0, trackWidth - containerWidth), right: 0 });
        const cards = Array.from(trackRef.current.children);
        if (cards.length >= 2) {
            stepRef.current = cards[1].offsetLeft - cards[0].offsetLeft;
        } else if (cards.length === 1) {
            stepRef.current = cards[0].offsetWidth + 24;
        }
    }, []);

    useEffect(() => {
        const raf = requestAnimationFrame(measureLayout);
        window.addEventListener('resize', measureLayout);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measureLayout); };
    }, [filtered, measureLayout]);

    const goToCard = useCallback((index) => {
        const clamped = Math.max(0, Math.min(index, filtered.length - 1));
        const step = stepRef.current;
        const maxDrag = Math.abs(constraints.left);
        const targetX = -Math.min(clamped * step, maxDrag);
        animate(x, targetX, { type: 'spring', stiffness: 300, damping: 30 });
        setActiveIndex(clamped);
    }, [filtered.length, constraints.left, x]);

    // Keep goToCard in liveRef so the interval always calls the latest version
    liveRef.current.goToCard = goToCard;

    const handleDragEnd = useCallback((_, info) => {
        const currentX = x.get();
        const step = stepRef.current;
        const velocity = info.velocity.x;
        const posIdx = -currentX / step;
        let targetIndex;
        if (velocity < -300) targetIndex = Math.ceil(posIdx);
        else if (velocity > 300) targetIndex = Math.floor(posIdx);
        else targetIndex = Math.round(posIdx);
        goToCard(targetIndex);
    }, [x, goToCard]);

    // Dot sync during drag — guard against elastic overshoot
    useEffect(() => {
        return x.on('change', (val) => {
            const step = stepRef.current;
            if (step <= 0) return;
            const rawIdx = -val / step;
            // Ignore positions outside valid card range (elastic overshoot)
            if (rawIdx < -0.5 || rawIdx > liveRef.current.filteredLength - 0.5) return;
            setActiveIndex(Math.max(0, Math.min(Math.round(rawIdx), liveRef.current.filteredLength - 1)));
        });
    }, [x]);

    // Reset position on filter change
    useEffect(() => {
        animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
        setActiveIndex(0);
    }, [activeFilter, x]);

    // Auto-scroll
    const startAutoScroll = useCallback(() => {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = setInterval(() => {
            if (isHovering.current) return;
            const { activeIndex: idx, filteredLength: len, goToCard: go } = liveRef.current;
            go?.((idx + 1) % len);
        }, 2500);
    }, []);

    useEffect(() => {
        if (inView) {
            startAutoScroll();
        } else {
            clearInterval(autoScrollRef.current);
        }
        return () => clearInterval(autoScrollRef.current);
    }, [inView, startAutoScroll]);

    // Restart auto-scroll when filter changes filtered.length
    useEffect(() => {
        if (inView) startAutoScroll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtered.length]);

    return (
        <section id="projects" className="w-full" ref={sectionRef}>
            <div className="w-full">
                <SectionHeading label="Work" title="Featured Projects" />

                {/* ── 3D Circular Gallery ── */}
                <div className="w-full h-[500px] mb-12 relative">
                    <CircularGallery
                        items={galleryItems}
                        radius={500}
                        autoRotateSpeed={0.015}
                        onItemClick={(id) => setSelected(projects.find((p) => p.id === id) ?? null)}
                    />
                </div>

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
                            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                                activeFilter === 'All'
                                    ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(226,160,78,0.15)]'
                                    : 'bg-surface/40 text-text-muted border-white/6 hover:border-white/15 hover:text-text'
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
                                className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                                    activeFilter === tech
                                        ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(226,160,78,0.15)]'
                                        : 'bg-surface/40 text-text-muted border-white/6 hover:border-white/15 hover:text-text'
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
                        onMouseEnter={() => { isHovering.current = true; }}
                        onMouseLeave={() => { isHovering.current = false; }}
                    >
                        {/* Left arrow — desktop only */}
                        <button
                            onClick={() => goToCard(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            aria-label="Previous project"
                            className="hidden sm:flex absolute -left-5 top-[50%] -translate-y-[22px] z-10 w-11 h-11 items-center justify-center rounded-full bg-surface border border-white/10 text-text-muted hover:text-text hover:border-accent/30 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Right arrow — desktop only */}
                        <button
                            onClick={() => goToCard(activeIndex + 1)}
                            disabled={activeIndex >= filtered.length - 1}
                            aria-label="Next project"
                            className="hidden sm:flex absolute -right-5 top-[50%] -translate-y-[22px] z-10 w-11 h-11 items-center justify-center rounded-full bg-surface border border-white/10 text-text-muted hover:text-text hover:border-accent/30 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {/*
                          Perspective wrapper (no overflow here — overflow:hidden would create a
                          stacking context that flattens preserve-3d children).
                          overflow:clip clips in X/Y without creating a stacking context.
                        */}
                        <div style={{ perspective: '1400px', perspectiveOrigin: 'center 50%' }}>
                            <div
                                ref={containerRef}
                                style={{ overflow: 'clip', position: 'relative' }}
                            >
                                <motion.div
                                    ref={trackRef}
                                    drag="x"
                                    dragConstraints={constraints}
                                    dragElastic={0.08}
                                    dragMomentum={false}
                                    onDragStart={() => { isHovering.current = true; }}
                                    onDragEnd={(e, info) => { isHovering.current = false; handleDragEnd(e, info); }}
                                    style={{ x, willChange: 'transform', transformStyle: 'preserve-3d' }}
                                    className="flex gap-6 cursor-grab active:cursor-grabbing pb-2"
                                >
                                    <AnimatePresence>
                                        {filtered.map((project, index) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                activeFilter={activeFilter}
                                                onClick={() => setSelected(project)}
                                                indexInFiltered={index}
                                                activeIndex={activeIndex}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center items-center gap-2 mt-5">
                            {filtered.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToCard(i)}
                                    aria-label={`Go to project ${i + 1}`}
                                    className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
                                >
                                    <span className={`rounded-full transition-all duration-300 ${
                                        i === activeIndex
                                            ? 'w-6 h-1.5 bg-accent'
                                            : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                                    }`} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        />

                        {/* ── Gist interactive demo modal ── */}
                        {isDemo ? (
                            <div className="fixed inset-4 md:inset-6 z-50 flex flex-col">
                                <motion.div
                                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative flex flex-col w-full h-full rounded-2xl border border-white/[0.08] bg-[#111110] overflow-hidden shadow-2xl shadow-black/60"
                                >
                                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                                                    <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)" />
                                                    <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7" stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)" />
                                                </svg>
                                                <span className="text-sm font-semibold text-text font-mono">Gist</span>
                                            </div>
                                            <span className="text-text-dim text-xs font-mono">—</span>
                                            <span className="text-text-dim text-xs font-mono">Interactive Demo</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href="https://github.com/parthiv-2006/Gist"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-text-muted text-xs font-mono border border-white/6 hover:border-white/20 hover:text-text transition-all duration-200"
                                            >
                                                <Github size={13} /> GitHub
                                            </a>
                                            <button
                                                onClick={() => setSelected(null)}
                                                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-text-dim hover:text-text hover:bg-surface-light transition-colors border border-transparent hover:border-white/[0.08]"
                                                aria-label="Close"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-h-0 p-4">
                                        <GistDemoWrapper />
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            /* ── Standard project detail modal ── */
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
                                onClick={() => setSelected(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40 flex flex-col max-h-[90vh]"
                                >
                                    <div className="p-6 md:p-8 pb-0 relative z-10 flex-shrink-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-mono text-accent text-xs tracking-wide mb-3">
                                                    {selected.role} · {selected.year}
                                                </p>
                                                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-2">
                                                    {selected.title}
                                                </h3>
                                                <p className="text-text-muted text-base">{selected.tagline}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelected(null)}
                                                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-text-dim hover:text-text hover:bg-surface-light transition-colors shrink-0 ml-4 border border-transparent hover:border-white/[0.08]"
                                                aria-label="Close"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mx-6 md:mx-8 my-6 h-px bg-white/[0.06] flex-shrink-0" />
                                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex-1 overflow-y-auto">
                                        <div className="prose prose-invert prose-sm md:prose-base max-w-none text-text-muted leading-relaxed mb-8">
                                            <p>{selected.description}</p>
                                        </div>
                                        <h4 className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-4">
                                            Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-2.5 mb-8">
                                            {selected.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-3.5 py-1.5 text-xs rounded-lg bg-surface-light text-text-muted font-mono border border-white/[0.08]"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {selected.github && (
                                                <a
                                                    href={selected.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-light text-text-muted text-sm font-medium border border-white/[0.08] hover:border-white/[0.2] hover:text-text transition-all duration-300"
                                                >
                                                    <Github size={16} /> Source Code
                                                </a>
                                            )}
                                            {selected.live && (
                                                <a
                                                    href={selected.live}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent/10 text-accent text-sm font-medium border border-accent/20 hover:bg-accent/20 hover:shadow-[0_0_15px_rgba(226,160,78,0.15)] transition-all duration-300"
                                                >
                                                    <ExternalLink size={16} /> Live Demo
                                                </a>
                                            )}
                                            {selected.devpost && (
                                                <a
                                                    href={selected.devpost}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-light text-text-muted text-sm font-medium border border-white/[0.08] hover:border-white/[0.2] hover:text-text transition-all duration-300"
                                                >
                                                    <Video size={16} /> Demo Video
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
