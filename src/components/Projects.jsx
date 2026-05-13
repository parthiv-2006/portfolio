import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, ArrowUpRight, Video } from 'lucide-react';
import SectionHeading from './SectionHeading';
import GistDemoWrapper from './GistDemo/index';

const projects = [
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
];

/* ── Derive unique tech tags from all projects ── */
const allTechs = [...new Set(projects.flatMap((p) => p.tech))].sort();

/* ── Filter pill animation ── */
const pillVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] },
    }),
};

/* ── List item animation ── */
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function Projects() {
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    /* ── Filtered project list ── */
    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((p) => p.tech.includes(activeFilter));
    }, [activeFilter]);

    const isDemo = selected?.hasDemo;

    // Signal to CursorTrail to yield to the native cursor while the demo is open
    useEffect(() => {
        if (isDemo && selected) {
            document.body.dataset.demoOpen = 'true';
        } else {
            delete document.body.dataset.demoOpen;
        }
        return () => { delete document.body.dataset.demoOpen; };
    }, [isDemo, selected]);

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
                            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer ${
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
                                className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 cursor-pointer ${
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

                {/* ── Projects List ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-text-dim font-mono text-sm">
                        No projects match this filter.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filtered.map((project, index) => (
                            <motion.div
                                key={project.id}
                                custom={index}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                onClick={() => setSelected(project)}
                                className="group relative rounded-2xl border border-white/6 bg-surface/40 overflow-hidden cursor-pointer transition-all duration-400 hover:border-accent/25 hover:bg-surface hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_var(--color-accent-glow)]"
                            >
                                <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1 flex flex-col min-h-full">
                                        {/* Number + year badge */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="font-mono text-accent text-xs tracking-widest">
                                                {String(projects.findIndex(p => p.id === project.id) + 1).padStart(2, '0')}
                                            </span>
                                            <span className="w-8 h-px bg-accent/30" />
                                            <span className="font-mono text-text-dim text-xs">{project.year}</span>
                                            {project.hasDemo && (
                                                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                                                    Live Demo
                                                </span>
                                            )}
                                        </div>

                                        {/* Title + tagline */}
                                        <h3 className="text-3xl md:text-4xl font-bold text-text tracking-tight group-hover:text-accent transition-colors duration-300 mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-text-muted text-sm md:text-base mb-5 font-medium">
                                            {project.tagline}
                                        </p>

                                        {/* Description excerpt */}
                                        <p className="text-text-dim text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
                                            {project.description}
                                        </p>

                                        {/* Tech stack pills */}
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {project.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className={`px-3 py-1.5 text-xs rounded-lg font-mono border transition-colors duration-300 ${
                                                        activeFilter === t
                                                            ? 'bg-accent/15 text-accent border-accent/25'
                                                            : 'bg-surface-light/50 text-text-muted border-white/8 group-hover:text-text group-hover:border-white/15'
                                                    }`}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Links */}
                                        <div className="flex items-center flex-wrap gap-4 mt-auto">
                                            <div className="flex flex-wrap gap-3">
                                                {project.github && (
                                                    <a
                                                        href={project.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-light text-text-muted text-xs md:text-sm font-mono border border-white/6 hover:border-white/20 hover:text-text transition-all duration-300"
                                                    >
                                                        <Github size={15} /> Source
                                                    </a>
                                                )}
                                                {project.hasDemo && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs md:text-sm font-mono border border-accent/20 hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                                                    >
                                                        <ExternalLink size={15} /> Live Demo
                                                    </button>
                                                )}
                                                {project.live && !project.hasDemo && (
                                                    <a
                                                        href={project.live}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs md:text-sm font-mono border border-accent/20 hover:bg-accent/20 transition-all duration-300"
                                                    >
                                                        <ExternalLink size={15} /> Live Demo
                                                    </a>
                                                )}
                                                {project.devpost && (
                                                    <a
                                                        href={project.devpost}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-light text-text-muted text-xs md:text-sm font-mono border border-white/6 hover:border-white/20 hover:text-text transition-all duration-300"
                                                    >
                                                        <Video size={15} /> Demo Video
                                                    </a>
                                                )}
                                            </div>

                                            <div className="ml-auto flex items-center gap-2 text-text-dim text-xs font-mono group-hover:text-accent transition-colors duration-300">
                                                <span>{project.hasDemo ? 'Try Demo' : 'Details'}</span>
                                                <ArrowUpRight
                                                    size={14}
                                                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom border accent on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Subtle glow effect on hover */}
                                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {selected && (
                    <>
                        {/* Backdrop */}
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
                            <div
                                className="fixed inset-4 md:inset-6 z-50 flex flex-col"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative flex flex-col w-full h-full rounded-2xl border border-white/[0.08] bg-[#111110] overflow-hidden shadow-2xl shadow-black/60"
                                >
                                    {/* Demo modal header */}
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

                                    {/* Demo body — fills remaining height */}
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
                                    {/* Header */}
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

                                    {/* Divider */}
                                    <div className="mx-6 md:mx-8 my-6 h-px bg-white/[0.06] flex-shrink-0" />

                                    {/* Body */}
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
