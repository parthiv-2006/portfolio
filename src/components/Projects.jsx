import { useState, useMemo, useEffect, useRef, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import GistDemoWrapper from './GistDemo/index';
import useIsTouch from '../hooks/useIsTouch';

const PROJECTS_PER_PAGE = 6;

const FOCUSABLE =
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

const projects = [
    {
        id: 'leaseguard',
        title: 'LeaseGuard',
        tagline: 'AI Legal Agent for Ontario Tenants',
        description:
            'An AI agent that reads Ontario residential lease PDFs and produces a grounded risk analysis backed by real statute and tribunal text — not training-data hallucinations. A custom MCP server exposes 12 tools to a Claude Haiku 4.5 orchestrator: parse the PDF, retrieve matching RTA sections, score clause risk deterministically, detect cross-clause contradictions, benchmark against real leases in the corpus, and generate negotiation guidance. Retrieval is hybrid BM25 + vector search with reciprocal rank fusion over a 2,372-chunk pgvector legal corpus, feeding a deterministic TypeScript risk engine covering 17 violation types. Full reports return in under 90 seconds, with 206 automated tests behind it — and every legal claim is traceable to a retrieved source.',
        tech: ['Next.js', 'TypeScript', 'Claude AI', 'MCP', 'RAG', 'Supabase', 'Python', 'Gemini AI'],
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
            'An autonomous CLI agent — published on PyPI as reflecta — that finds untested Python code, writes targeted pytest tests for it, then proves they work. Reflecta parses coverage.json to surface uncovered functions, generates full test files with Gemini Flash, executes them in an isolated subprocess, and uses Groq (Llama 3.1 8B to 3.3 70B escalation) to repair failures, escalating to Claude when repair stalls. Every kept test clears two gates: an AST-level assertion check and a strict coverage-delta gate — tests that pass but add no coverage are discarded. It lifted coverage from 64% to 80% on a real service across 338 tests.',
        tech: ['Python', 'pytest', 'Gemini AI', 'Groq', 'Claude AI', 'coverage.py', 'Typer', 'AST'],
        year: '2026',
        role: 'Dev Tool',
        github: 'https://github.com/parthiv-2006/Reflecta-Ai-Agent',
    },
    {
        id: 'angler',
        title: 'Angler',
        tagline: 'AI Creative Strategy for Affiliate Media Buyers',
        description:
            'Built for the ItsTodayMedia $5,000 Build Challenge. A four-module AI tool for affiliate media buyers, built solo in 10 days, that answers the question most teams never ask: which ads should we make? Pick a vertical, and Angler mines top competitor ads from the Meta Ad Library via Apify ranked by longevity, deconstructs each winner into structured creative DNA with a vision-language model, audits your own ad set for semantic diversity gaps using Entity ID analysis, and generates prioritized angle briefs with platform-ready copy for Meta, TikTok, and native. The entire intelligence layer is also exposed as a public MCP server callable from Claude Desktop, hardened by a security audit across 21 tests.',
        tech: ['Next.js', 'TypeScript', 'Claude AI', 'Supabase', 'Apify', 'Zod', 'MCP'],
        year: '2026',
        role: 'AI Tool',
        github: 'https://github.com/parthiv-2006/Angler',
        live: 'https://www.angler.software',
        competition: '$5K Build Challenge',
    },
    {
        id: 'glowi',
        title: 'Glowi',
        tagline: 'AI-Powered Skincare Analysis',
        description:
            'A mobile app that photographs a skin concern, runs a cinematic AI scan with Skia-rendered visuals, and delivers a personalized protocol: curated products with retailer links, evidence-based nutrition with PubMed citations, and routines built around your scan. Features cross-session AI memory, a Skin Weather forecast that adapts advice to local UV/humidity/pollen, a product Shelf with AI label reading and ingredient conflict detection, and a memory-aware skincare coach.',
        tech: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Claude AI', 'Zustand'],
        year: '2026',
        role: 'AI + Mobile',
        github: 'https://github.com/parthiv-2006/Glowi',
        underDevelopment: true,
    },
    {
        id: 'palate',
        title: 'Palate',
        tagline: 'AI Restaurant Recommender',
        description:
            'An AI-powered social dining app built for UofTHacks 2026. I built the Next.js frontend and end-to-end passkey authentication (WebAuthn), submitted against the 1Password challenge — cryptographic passkeys replacing passwords entirely. Combining behavioral analytics with a Google Gemini engine, Palate turns group swipe data into restaurant picks and cuts through group indecision.',
        tech: ['Next.js', 'TypeScript', 'MongoDB', 'Gemini AI', 'WebAuthn'],
        year: '2026',
        role: 'Full-Stack',
        github: 'https://github.com/parthiv-2006/palate',
        live: 'https://palate-self.vercel.app/',
        devpost: 'https://devpost.com/software/palate-3uic5p',
        hackathon: 'UofTHacks 2026',
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
    },
];

// A chip that matches exactly one project isn't a filter, it's a link to that
// card — and there were 18 of them, burying the grid under eleven rows of
// chips on mobile. Only techs shared by two or more projects earn a chip.
const techCounts = projects.reduce((acc, p) => {
    p.tech.forEach((t) => { acc[t] = (acc[t] || 0) + 1; });
    return acc;
}, {});
const allTechs = Object.keys(techCounts)
    .filter((t) => techCounts[t] >= 2)
    .sort((a, b) => techCounts[b] - techCounts[a] || a.localeCompare(b));

function ProjectCard({ project, index, activeFilter, isTouch, onClick }) {
    const displayNum = String(index + 1).padStart(2, '0');
    const cta = project.hasDemo && !isTouch ? 'Demo' : 'View';

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative border border-white/[0.06] rounded-[18px] overflow-hidden bg-surface cursor-pointer flex flex-col p-5 sm:p-6 pb-5 transition-all duration-400 hover:-translate-y-[7px] hover:border-accent/40 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] has-[:focus-visible]:-translate-y-[7px] has-[:focus-visible]:border-accent/40 has-[:focus-visible]:[outline:2px_solid_var(--color-accent)] has-[:focus-visible]:[outline-offset:3px]"
        >
            {/* Ghost number watermark */}
            <span
                className="absolute top-[-10px] right-[14px] font-display italic text-[100px] leading-none text-surface2 pointer-events-none select-none z-0"
                aria-hidden="true"
            >
                {displayNum}
            </span>

            {/* Header: role + year + badge */}
            <div className="relative z-[1] flex items-center justify-between gap-2 flex-wrap mb-[18px]">
                <span className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
                    {project.role}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-text-dim">{project.year}</span>
                    {project.hasDemo && !isTouch && (
                        <span className="font-mono text-[11px] text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
                            Interactive
                        </span>
                    )}
                    {project.hackathon && (
                        <span className="font-mono text-[11px] text-badge-violet bg-violet-500/10 border border-violet-500/25 px-2 py-0.5 rounded-full">
                            {project.hackathon}
                        </span>
                    )}
                    {project.competition && (
                        <span className="font-mono text-[11px] text-badge-teal bg-teal-500/10 border border-teal-500/25 px-2 py-0.5 rounded-full">
                            {project.competition}
                        </span>
                    )}
                    {project.underDevelopment && (
                        <span
                            className="font-mono text-[11px] text-badge-amber bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full"
                            style={{ animation: 'badge-pulse 2.4s ease-in-out infinite' }}
                        >
                            Under Development
                        </span>
                    )}
                </div>
            </div>

            {/* Title — the button stretches over the whole card via ::after, so the
                card is one keyboard stop with real heading semantics preserved.
                The heading must NOT be position:relative — that would make it
                (not the article) the containing block for the ::after overlay,
                shrinking the "click anywhere on the card" target down to just
                the title line. Flex items still get correct paint order from
                z-index alone (no position needed), so the stacking intent holds. */}
            <h3 className="z-[2] font-display italic text-[2rem] font-normal leading-[1.05] tracking-[-0.01em] mb-[10px]">
                <button
                    type="button"
                    onClick={onClick}
                    className="text-left after:absolute after:inset-0 after:content-[''] after:rounded-[18px] focus-visible:outline-none"
                >
                    {project.title}<span className="text-accent">.</span>
                    <span className="sr-only"> — open project details</span>
                </button>
            </h3>

            {/* Tagline */}
            <p className="relative z-[1] text-[14px] text-text-muted leading-[1.55] mb-5">
                {project.tagline}
            </p>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mt-auto mb-4" />

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
        </motion.article>
    );
}

/**
 * Modal plumbing the markup can't express on its own: move focus in, keep Tab
 * inside, close on Escape, lock the page behind it, and hand focus back to
 * whatever opened it — including when the close came from Escape or backdrop.
 */
function useDialog(isOpen, onClose, dialogRef) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const opener = document.activeElement;
        const { body } = document;
        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;

        body.style.overflow = 'hidden';
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        const items = () =>
            Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? []).filter(
                (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
            );

        const frame = requestAnimationFrame(() => {
            (items()[0] ?? dialogRef.current)?.focus({ preventScroll: true });
        });

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const node = dialogRef.current;
            const list = items();
            if (!node) return;
            if (list.length === 0) {
                e.preventDefault();
                node.focus({ preventScroll: true });
                return;
            }

            const first = list[0];
            const last = list[list.length - 1];
            const active = document.activeElement;
            const outside = !node.contains(active);

            if (e.shiftKey && (active === first || outside)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || outside)) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown, true);

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('keydown', onKeyDown, true);
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPaddingRight;
            if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
        };
    }, [isOpen, onClose, dialogRef]);
}

/** Reads the `?project=` query param, validated against the known project ids. */
function projectIdFromUrl() {
    if (typeof window === 'undefined') return null;
    const id = new URLSearchParams(window.location.search).get('project');
    return projects.some((p) => p.id === id) ? id : null;
}

/**
 * Keeps the open project synced with `?project=<id>` so a card can be shared
 * as a direct link, the back button closes the modal instead of leaving the
 * page, and each project gets its own title/description for link previews.
 */
function useProjectDeepLink() {
    const [selectedId, setSelectedId] = useState(projectIdFromUrl);
    const selected = useMemo(() => projects.find((p) => p.id === selectedId) ?? null, [selectedId]);

    // Guards against re-pushing history for changes we didn't originate —
    // the initial URL-derived state, and state set in response to popstate.
    const skipNextSyncRef = useRef(true);
    const fromPopStateRef = useRef(false);

    useEffect(() => {
        if (skipNextSyncRef.current) { skipNextSyncRef.current = false; return; }
        if (fromPopStateRef.current) { fromPopStateRef.current = false; return; }

        const params = new URLSearchParams(window.location.search);
        if (selectedId) params.set('project', selectedId); else params.delete('project');
        const query = params.toString();
        const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;

        // Opening pushes a new entry (so Back closes the modal); closing
        // replaces in place rather than stacking an extra history entry.
        if (selectedId) {
            window.history.pushState({ project: selectedId }, '', url);
        } else {
            window.history.replaceState({}, '', url);
        }
    }, [selectedId]);

    useEffect(() => {
        const onPopState = () => {
            fromPopStateRef.current = true;
            setSelectedId(projectIdFromUrl());
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // Swap in the open project's title/description for the link-preview meta
    // tags while the modal is up, then restore whatever was there before.
    useEffect(() => {
        if (!selected) return undefined;

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        const metaDesc = document.querySelector('meta[name="description"]');
        const prev = {
            title: document.title,
            ogTitle: ogTitle?.content,
            ogDesc: ogDesc?.content,
            twTitle: twTitle?.content,
            twDesc: twDesc?.content,
            metaDesc: metaDesc?.content,
        };

        const newTitle = `${selected.title} | Parthiv Paul`;
        document.title = newTitle;
        if (ogTitle) ogTitle.content = newTitle;
        if (ogDesc) ogDesc.content = selected.tagline;
        if (twTitle) twTitle.content = newTitle;
        if (twDesc) twDesc.content = selected.tagline;
        if (metaDesc) metaDesc.content = selected.tagline;

        return () => {
            document.title = prev.title;
            if (ogTitle) ogTitle.content = prev.ogTitle;
            if (ogDesc) ogDesc.content = prev.ogDesc;
            if (twTitle) twTitle.content = prev.twTitle;
            if (twDesc) twDesc.content = prev.twDesc;
            if (metaDesc) metaDesc.content = prev.metaDesc;
        };
    }, [selected]);

    return [selected, setSelectedId];
}

export default function Projects() {
    const [selected, setSelectedId] = useProjectDeepLink();
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(0);
    const isTouch = useIsTouch();
    const dialogRef = useRef(null);
    const titleId = useId();

    const closeModal = useCallback(() => setSelectedId(null), [setSelectedId]);

    const filtered = useMemo(() => {
        if (activeFilter === 'All') return projects;
        return projects.filter((p) => p.tech.includes(activeFilter));
    }, [activeFilter]);

    // Pagination only applies to "All" view
    const isPaginated = activeFilter === 'All';
    const totalPages = isPaginated ? Math.ceil(projects.length / PROJECTS_PER_PAGE) : 1;
    const displayedProjects = isPaginated
        ? filtered.slice(currentPage * PROJECTS_PER_PAGE, (currentPage + 1) * PROJECTS_PER_PAGE)
        : filtered;

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(0);
    }, [activeFilter]);

    // On touch/mobile devices, show the standard project modal instead of the interactive demo
    // (the demo is a Chrome extension UI — desktop only makes sense)
    const isDemo = selected?.hasDemo && !isTouch;

    useEffect(() => {
        if (isDemo && selected) {
            document.body.dataset.demoOpen = 'true';
        } else {
            delete document.body.dataset.demoOpen;
        }
        return () => { delete document.body.dataset.demoOpen; };
    }, [isDemo, selected]);

    useDialog(Boolean(selected), closeModal, dialogRef);

    const atStart = currentPage === 0;
    const atEnd = currentPage === totalPages - 1;

    // Announced to screen readers on every filter/page change, and printed
    // above the grid so the counts are visible too.
    let resultSummary;
    if (filtered.length === 0) {
        resultSummary = `No projects use ${activeFilter}`;
    } else if (isPaginated && totalPages > 1) {
        resultSummary = `Showing ${displayedProjects.length} of ${projects.length} projects — page ${currentPage + 1} of ${totalPages}`;
    } else if (isPaginated) {
        resultSummary = `Showing all ${projects.length} projects`;
    } else {
        resultSummary = `${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'} using ${activeFilter}`;
    }

    return (
        <section id="work" className="w-full">
            <SectionHeading label="Selected work" title="Things I've built" />

            {/* Filter pills — toggle buttons, so their pressed state is announced */}
            <div role="group" aria-label="Filter projects by technology" className="flex gap-2 flex-wrap mb-5">
                {['All', ...allTechs].map((tech) => {
                    const isActive = activeFilter === tech;
                    return (
                        <button
                            key={tech}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setActiveFilter(tech)}
                            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-250 cursor-pointer min-h-[44px] ${
                                isActive
                                    ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_var(--color-accent-glow)]'
                                    : 'bg-surface/40 text-text-muted border-white/[0.06] hover:border-white/[0.15] hover:text-text'
                            }`}
                        >
                            {tech}
                        </button>
                    );
                })}
            </div>

            {/* Result count — doubles as the live region for filter/page changes */}
            <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="font-mono text-[11px] tracking-[0.14em] uppercase text-text-dim mb-8"
            >
                {resultSummary}
            </p>

            {/* Grid. Every filter option is derived from the project list, so an
                empty result is unreachable — the fallback is a safety net only. */}
            {displayedProjects.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16">
                    <p className="text-text-dim font-mono text-sm">No projects match this filter.</p>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('All')}
                        className="px-4 py-2 min-h-[44px] text-xs font-mono rounded-full border border-accent/30 bg-accent/10 text-accent cursor-pointer hover:bg-accent/20 transition-colors duration-250"
                    >
                        Show all projects
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isPaginated ? `page-${currentPage}` : `filter-${activeFilter}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]"
                    >
                        {displayedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={projects.findIndex((p) => p.id === project.id)}
                                activeFilter={activeFilter}
                                isTouch={isTouch}
                                onClick={() => setSelectedId(project.id)}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Pagination arrows — only on "All" view with multiple pages.
                aria-disabled rather than disabled so the arrow you just used to
                reach the last page keeps focus instead of dropping it to body. */}
            {isPaginated && totalPages > 1 && (
                <nav aria-label="Project pages" className="flex items-center justify-center gap-5 mt-10">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        aria-disabled={atStart}
                        aria-label="Previous page of projects"
                        className={`flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-250 bg-surface ${
                            atStart
                                ? 'opacity-35 cursor-not-allowed border-white/[0.04]'
                                : 'cursor-pointer border-white/[0.08] hover:border-accent/40 hover:bg-accent/5 hover:text-accent'
                        }`}
                    >
                        <ChevronLeft size={18} className={atStart ? 'text-text-dim' : 'text-text-muted'} />
                    </button>

                    {/* Page dots */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentPage(i)}
                                aria-label={`Go to page ${i + 1} of ${totalPages}`}
                                aria-current={i === currentPage ? 'true' : undefined}
                                className="min-h-[44px] min-w-[36px] flex items-center justify-center cursor-pointer rounded-lg"
                            >
                                <span
                                    className={`block rounded-full transition-all duration-300 ${
                                        i === currentPage
                                            ? 'w-7 h-2 bg-accent shadow-[0_0_10px_var(--color-accent-dim)]'
                                            : 'w-2 h-2 bg-text-dim/40 hover:bg-text-dim/70'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        aria-disabled={atEnd}
                        aria-label="Next page of projects"
                        className={`flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-250 bg-surface ${
                            atEnd
                                ? 'opacity-35 cursor-not-allowed border-white/[0.04]'
                                : 'cursor-pointer border-white/[0.08] hover:border-accent/40 hover:bg-accent/5 hover:text-accent'
                        }`}
                    >
                        <ChevronRight size={18} className={atEnd ? 'text-text-dim' : 'text-text-muted'} />
                    </button>
                </nav>
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
                            onClick={closeModal}
                            aria-hidden="true"
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        />

                        {/* Gist interactive demo modal */}
                        {isDemo ? (
                            <div className="fixed inset-2 sm:inset-4 md:inset-6 z-50 flex flex-col">
                                <motion.div
                                    ref={dialogRef}
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby={titleId}
                                    tabIndex={-1}
                                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative flex flex-col w-full h-full rounded-2xl border border-white/[0.08] bg-bg overflow-hidden shadow-2xl shadow-black/60 focus:outline-none"
                                >
                                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
                                        <div className="flex items-center gap-3">
                                            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                                                <rect width="32" height="32" rx="6" fill="oklch(0.75 0.11 150)" />
                                                <path d="M 20.8 11.5 A 7 7 0 1 0 20.8 15.2 H 24 V 21.5 Q 24 26.2 18.4 26.2 Q 13.8 26.2 13.4 22.7" stroke="oklch(0.22 0.03 150)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M 14 7.5 C 19 9.2 20 17 14 19.5 C 8 17 9 9.2 14 7.5 Z" fill="oklch(0.30 0.07 150)" />
                                            </svg>
                                            <span id={titleId} className="text-sm font-semibold text-text font-mono">
                                                Gist
                                                <span className="sr-only"> interactive demo</span>
                                            </span>
                                            <span className="text-text-dim text-xs font-mono hidden sm:inline" aria-hidden="true">—</span>
                                            <span className="text-text-dim text-xs font-mono hidden sm:inline" aria-hidden="true">Interactive Demo</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href="https://github.com/parthiv-2006/Gist"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-text-muted text-xs font-mono border border-white/[0.06] hover:border-white/20 hover:text-text transition-all duration-200"
                                            >
                                                <Github size={13} aria-hidden="true" /> GitHub
                                            </a>
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-text-dim hover:text-text hover:bg-surface-light transition-colors border border-transparent hover:border-white/[0.08] cursor-pointer"
                                                aria-label="Close interactive demo"
                                            >
                                                <X size={18} aria-hidden="true" />
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
                                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
                                onClick={closeModal}
                            >
                                <motion.div
                                    ref={dialogRef}
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby={titleId}
                                    tabIndex={-1}
                                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-full max-w-[620px] rounded-2xl border border-white/[0.08] bg-surface overflow-hidden shadow-2xl shadow-black/40 flex flex-col max-h-[90vh] focus:outline-none"
                                >
                                    {/* Modal header */}
                                    <div className="relative p-5 sm:p-7 pb-0 pr-14 sm:pr-16 flex-shrink-0 overflow-hidden">
                                        {/* Ghost number */}
                                        <span className="absolute bottom-[-24px] right-[18px] font-display italic text-[130px] leading-none text-surface2 pointer-events-none select-none" aria-hidden="true">
                                            {String(projects.findIndex(p => p.id === selected.id) + 1).padStart(2, '0')}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="absolute top-3.5 right-3.5 z-[2] w-10 h-10 rounded-full flex items-center justify-center border border-white/[0.08] bg-surface2 text-text-muted hover:text-text hover:border-accent/40 cursor-pointer transition-colors"
                                            aria-label={`Close ${selected.title} details`}
                                        >
                                            <X size={15} aria-hidden="true" />
                                        </button>
                                        <p className="relative z-[1] font-mono text-[11px] tracking-[0.14em] uppercase text-accent mb-3">
                                            {selected.role} · {selected.year}
                                        </p>
                                        <h3 id={titleId} className="relative z-[1] font-display italic text-[clamp(1.6rem,5vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.01em] mb-2">
                                            {selected.title}<span className="text-accent">.</span>
                                        </h3>
                                        <p className="relative z-[1] text-text-muted text-[15px] leading-[1.5]">{selected.tagline}</p>
                                    </div>

                                    <div className="mx-5 sm:mx-7 my-5 sm:my-6 h-px bg-white/[0.06] flex-shrink-0" />

                                    <div className="px-5 sm:px-7 pb-6 sm:pb-7 flex-1 overflow-y-auto overscroll-contain">
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
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-surface2 text-text-muted text-sm border border-white/[0.08] hover:border-white/20 hover:text-text transition-all duration-250">
                                                    <Github size={16} aria-hidden="true" /> Source Code
                                                </a>
                                            )}
                                            {selected.live && (
                                                <a href={selected.live} target="_blank" rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-accent/10 text-accent text-sm border border-accent/20 hover:bg-accent/20 transition-all duration-250">
                                                    <ExternalLink size={16} aria-hidden="true" /> Live Demo
                                                </a>
                                            )}
                                            {selected.devpost && (
                                                <a href={selected.devpost} target="_blank" rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-surface2 text-text-muted text-sm border border-white/[0.08] hover:border-white/20 hover:text-text transition-all duration-250">
                                                    <Video size={16} aria-hidden="true" /> Demo Video
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
