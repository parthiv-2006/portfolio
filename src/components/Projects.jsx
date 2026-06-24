import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Video } from 'lucide-react';
import SectionHeading from './SectionHeading';
import GistDemoWrapper from './GistDemo/index';

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
        image: '/projects/leaseguard.png',
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
        image: '/projects/gist.png',
    },
    {
        id: 'reflecta',
        title: 'Reflecta',
        tagline: 'Self-Improving Test Coverage Agent',
        description:
            'An autonomous CLI agent that finds untested Python code and writes targeted pytest tests for it, then proves they work. Reflecta parses coverage.json to surface uncovered functions, generates full test files with Gemini Flash, executes them in an isolated subprocess, and uses Groq (Llama 3.1 8B to 3.3 70B escalation) to repair failures. Every kept test clears two gates: an AST-level assertion check and a strict coverage-delta gate. Tests that pass but add no coverage are discarded.',
        tech: ['Python', 'pytest', 'Gemini AI', 'Groq', 'coverage.py', 'Typer'],
        year: '2026',
        role: 'Dev Tool',
        github: 'https://github.com/parthiv-2006/Reflecta-Ai-Agent',
        wip: true,
        image: '/projects/Reflecta.png',
    },
    {
        id: 'anima',
        title: 'Anima',
        tagline: 'Gamified Habit Tracking',
        description:
            '"Your Tamagotchi for Productivity." Anima turns habit tracking into a game. Instead of checking boxes, users keep a streak by caring for a virtual pet that grows with their consistency.',
        tech: ['React', 'Vite', 'Zustand', 'Framer Motion', 'MongoDB'],
        year: '2025',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/Anima',
        live: 'https://anima-client.vercel.app/',
        image: '/projects/animaProject.png',
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
        live: 'https://macro-match-cyan.vercel.app/',
        image: '/projects/macromatch.png',
    },
    {
        id: 'palate',
        title: 'Palate',
        tagline: 'AI Restaurant Recommender',
        description:
            'An AI-powered social dining app built for UofTHacks 2026. Combining behavioral analytics with Google Gemini AI, Palate cuts through group indecision with personalized recommendations, authenticated via passkey-first WebAuthn.',
        tech: ['Next.js', 'TypeScript', 'MongoDB', 'Gemini AI', 'WebAuthn'],
        year: '2026',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/palate',
        live: 'https://palate-self.vercel.app/',
        devpost: 'https://devpost.com/software/palate-3uic5p',
        image: '/projects/palate.png',
    },
];

const allTechs = [...new Set(projects.flatMap((p) => p.tech))].sort();

function ProjectCard({ project, index, activeFilter, onClick }) {
    const displayNum = String(index + 1).padStart(2, '0');
    const cta = project.hasDemo ? 'Demo' : 'View';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClick}
            className="relative border border-white/[0.06] rounded-[18px] overflow-hidden bg-surface cursor-pointer flex flex-col p-6 pb-5 transition-all duration-400 hover:-translate-y-[7px] hover:border-accent/40 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
        >
            {/* Ghost number watermark */}
            <span
                className="absolute top-[-10px] right-[14px] font-display italic text-[100px] leading-none text-surface2 pointer-events-none select-none z-0"
                aria-hidden="true"
            >
                {displayNum}
            </span>

            {/* Header: role + year + badge */}
            <div className="relative z-[1] flex items-center justify-between mb-[18px]">
                <span className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
                    {project.role}
                </span>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-text-dim">{project.year}</span>
                    {project.hasDemo && (
                        <span className="font-mono text-[11px] text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
                            Live Demo
                        </span>
                    )}
                    {project.wip && (
                        <span className="font-mono text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            In Dev
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="relative z-[1] font-display italic text-[2rem] font-normal leading-[1.05] tracking-[-0.01em] mb-[10px]">
                {project.title}<span className="text-accent">.</span>
            </h3>

            {/* Tagline */}
            <p className="relative z-[1] text-[14px] text-text-muted leading-[1.55] mb-auto pb-[22px]">
                {project.tagline}
            </p>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-4" />

            {/* Bottom: tech + cta */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t) => (
                        <span
                            key={t}
                            className={`font-mono text-[11px] border px-2 py-0.5 rounded-md transition-colors duration-200 ${
                                activeFilter === t
                                    ? 'text-accent bg-accent/10 border-accent/25'
                                    : 'text-text-muted bg-surface2/60 border-white/[0.06]'
                            }`}
                        >
                            {t}
                        </span>
                    ))}
                    {project.tech.length > 3 && (
                        <span className="font-mono text-[11px] text-text-dim px-1">
                            +{project.tech.length - 3}
                        </span>
                    )}
                </div>
                <span className="font-mono text-[12px] text-accent whitespace-nowrap shrink-0">
                    {cta} ↗
                </span>
            </div>
        </motion.div>
    );
}

export default function Projects() {
    const [selected, setSelected] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((p) => p.tech.includes(activeFilter));
    }, [activeFilter]);

    const isDemo = selected?.hasDemo;

    useEffect(() => {
        if (isDemo && selected) {
            document.body.dataset.demoOpen = 'true';
        } else {
            delete document.body.dataset.demoOpen;
        }
        return () => { delete document.body.dataset.demoOpen; };
    }, [isDemo, selected]);

    return (
        <section id="work" className="w-full">
            <SectionHeading label="Selected work" title="Things I've built" />

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap mb-8">
                {['All', ...allTechs].map((tech) => (
                    <button
                        key={tech}
                        onClick={() => setActiveFilter(tech)}
                        className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-250 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                            activeFilter === tech
                                ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(226,160,78,0.15)]'
                                : 'bg-surface/40 text-text-muted border-white/[0.06] hover:border-white/[0.15] hover:text-text'
                        }`}
                    >
                        {tech}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <p className="text-text-dim font-mono text-sm text-center py-16">
                    No projects match this filter.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
                    {filtered.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={projects.findIndex((p) => p.id === project.id)}
                            activeFilter={activeFilter}
                            onClick={() => setSelected(project)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
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

                        {/* Gist interactive demo modal */}
                        {isDemo ? (
                            <div className="fixed inset-2 sm:inset-4 md:inset-6 z-50 flex flex-col">
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
                                            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)" />
                                                <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7" stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)" />
                                            </svg>
                                            <span className="text-sm font-semibold text-text font-mono">Gist</span>
                                            <span className="text-text-dim text-xs font-mono hidden sm:inline">—</span>
                                            <span className="text-text-dim text-xs font-mono hidden sm:inline">Interactive Demo</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href="https://github.com/parthiv-2006/Gist"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-text-muted text-xs font-mono border border-white/[0.06] hover:border-white/20 hover:text-text transition-all duration-200"
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
                            /* Standard project detail modal */
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
                                    className="relative w-full max-w-[620px] rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40 flex flex-col max-h-[88vh]"
                                >
                                    {/* Modal header */}
                                    <div className="relative p-7 pb-0 flex-shrink-0 overflow-hidden">
                                        {/* Ghost number */}
                                        <span className="absolute bottom-[-24px] right-[18px] font-display italic text-[130px] leading-none text-surface2 pointer-events-none select-none" aria-hidden="true">
                                            {String(projects.findIndex(p => p.id === selected.id) + 1).padStart(2, '0')}
                                        </span>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center border border-white/[0.08] bg-surface2 text-text-muted hover:text-text cursor-pointer transition-colors"
                                            aria-label="Close"
                                        >
                                            <X size={15} />
                                        </button>
                                        <p className="relative z-[1] font-mono text-[11px] tracking-[0.14em] uppercase text-accent mb-3">
                                            {selected.role} · {selected.year}
                                        </p>
                                        <h3 className="relative z-[1] font-display italic text-[clamp(1.6rem,5vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.01em] mb-2">
                                            {selected.title}<span className="text-accent">.</span>
                                        </h3>
                                        <p className="relative z-[1] text-text-muted text-[15px] leading-[1.5]">{selected.tagline}</p>
                                    </div>

                                    <div className="mx-7 my-6 h-px bg-white/[0.06] flex-shrink-0" />

                                    <div className="px-7 pb-7 flex-1 overflow-y-auto">
                                        <p className="text-text-muted text-sm leading-relaxed mb-7">{selected.description}</p>

                                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-3">Tech Stack</p>
                                        <div className="flex flex-wrap gap-2 mb-7">
                                            {selected.tech.map((t) => (
                                                <span key={t} className="font-mono text-xs text-text-muted bg-surface2 border border-white/[0.08] px-3 py-1.5 rounded-lg">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {selected.github && (
                                                <a href={selected.github} target="_blank" rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface2 text-text-muted text-sm border border-white/[0.08] hover:border-white/20 hover:text-text transition-all duration-250">
                                                    <Github size={16} /> Source Code
                                                </a>
                                            )}
                                            {selected.live && (
                                                <a href={selected.live} target="_blank" rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent/10 text-accent text-sm border border-accent/20 hover:bg-accent/20 transition-all duration-250">
                                                    <ExternalLink size={16} /> Live Demo
                                                </a>
                                            )}
                                            {selected.devpost && (
                                                <a href={selected.devpost} target="_blank" rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface2 text-text-muted text-sm border border-white/[0.08] hover:border-white/20 hover:text-text transition-all duration-250">
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
