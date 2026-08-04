import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Rocket, Code2, Terminal as TerminalIcon } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Credentials from './Credentials';

const entries = [
    {
        icon: Briefcase,
        title: 'Velox Systems',
        subtitle: 'Software Engineer',
        date: 'Jul 2026 – Present',
        location: 'Toronto, ON',
        current: true,
        description:
            "Sole developer on the rebuild of a landscaping contractor's production workspace — migrating a live safety-compliance app onto a FastAPI/Postgres backend and cutting authentication from Supabase over to Zitadel OIDC, all behind a zero-error type and lint gate. Also shipped a route-planning module that turns a 4,756-tree municipal registry into truck-days in driving order and syncs offline crew completions back to the office, retiring a 95-file legacy planner.",
        stack: ['FastAPI', 'PostgreSQL', 'Zitadel OIDC', 'TypeScript'],
        type: 'experience',
    },
    {
        icon: Code2,
        title: 'Applied Optimal Inc.',
        subtitle: 'Full-Stack Developer, Contract',
        date: 'Jul 2026 – Sep 2026',
        location: 'Remote',
        description:
            'Built a 7-day trial to paid subscription system with member-count fee tiers, checkout, a reminder job, and server-side route lockout — 4 migrations and 130 automated tests. Worked a Jira ticket and peer-review loop on a 3-developer team, resolving spec gaps with a non-technical client across twice-weekly syncs, restoring blocking flake8 and black CI, and clearing 77 Flutter analyzer warnings.',
        stack: ['FastAPI', 'PostgreSQL', 'Stripe', 'Flutter Web', 'Jira'],
        type: 'experience',
    },
    {
        icon: TerminalIcon,
        title: 'GenLedge',
        subtitle: 'Software Developer, Contract',
        date: 'Mar 2026 – May 2026',
        location: 'Remote',
        description:
            'Built a Stripe MCP server (TypeScript, 12 tools) covering charges, invoices, subscriptions, and disputes, enabling AI accounting agents to query live payment data via the Model Context Protocol. Also built a Stripe webhook handler that verified event authenticity and routed 12 event types to specialized AI employee roles, generating real-time general-ledger entries automatically.',
        stack: ['TypeScript', 'MCP', 'Stripe', 'Webhooks'],
        type: 'experience',
    },
    {
        icon: Rocket,
        title: 'Outamation',
        subtitle: 'AI and Automation Extern',
        date: 'May 2025 – Aug 2025',
        location: 'Remote',
        description:
            'Built NLP and Computer Vision (OCR) pipelines to classify and extract fields from mortgage documents, replacing a manual data-entry step on the program’s sample document set. Improved retrieval relevance by ~25% on a benchmark query set by tuning a Retrieval-Augmented Generation (RAG) system in LlamaIndex, iterating on chunking strategy and custom vector embeddings.',
        stack: ['Python', 'LlamaIndex', 'RAG', 'OCR'],
        type: 'experience',
    },
    {
        icon: GraduationCap,
        title: 'University of Toronto, St. George',
        subtitle: 'Computer Science Specialist, Co-op',
        date: 'Sept 2024 – Apr 2028',
        location: 'Toronto, ON · CGPA 3.6/4.0',
        description:
            "Pursuing a Bachelor of Computer Science. Dean's List Scholar in 2024-25 and 2025-26. Coursework includes Data Structures & Analysis, Software Design, Systems Programming, Computer Organization, Theory of Computation, and Linear Algebra.",
        type: 'education',
    },
    {
        icon: Briefcase,
        title: 'Chester-Hill Solutions',
        subtitle: 'Software QA Tester, Intern',
        date: 'June 2024 – Nov 2024',
        location: 'Remote',
        description:
            'Wrote automated test scripts covering 50+ user flows across multiple environments, cutting the repetitive manual regression passes the team ran each release cycle. Investigated and documented defects through API response analysis and root-cause write-ups, giving developers clearer repro steps to turn around fixes faster.',
        stack: ['Test Automation', 'REST APIs'],
        type: 'experience',
    },
    {
        icon: Award,
        title: 'Ontario Liberal Party',
        subtitle: 'Frontend Developer',
        date: 'May 2023 – Sept 2023',
        location: 'Toronto, ON',
        description:
            'Built React components and optimized Redux state management. Refactored legacy CSS into modular Sass and enforced WCAG 2.1 compliance, improving page performance and accessibility scores.',
        stack: ['React', 'Redux', 'Sass', 'WCAG 2.1'],
        type: 'experience',
    },
];

function TimelineEntry({ entry, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            {/* Dot */}
            <span className="absolute left-[-38px] top-[6px] w-3 h-3 rounded-full bg-accent ring-4 ring-bg shadow-[0_0_14px_rgba(226,160,78,0.4)]" />
            {entry.current && (
                <span
                    className="absolute left-[-44px] top-0 w-6 h-6 rounded-full border border-accent pointer-events-none"
                    style={{ animation: 'ring-pulse 2.6s ease-out infinite' }}
                    aria-hidden="true"
                />
            )}

            {/* Card */}
            <div className="border border-white/[0.06] rounded-2xl bg-surface p-5 transition-all duration-300 hover:border-white/[0.12] hover:translate-x-1">
                <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
                    <p className="font-mono text-xs text-accent">{entry.date}</p>
                    {entry.location && (
                        <p className="font-mono text-[11px] text-text-dim">{entry.location}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[17px] font-semibold text-text">{entry.title}</h3>
                    {entry.current && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full">
                            Current
                        </span>
                    )}
                </div>

                <p className="text-[13.5px] text-accent mb-2">{entry.subtitle}</p>
                <p className="text-sm text-text-muted leading-relaxed">{entry.description}</p>

                {entry.stack && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {entry.stack.map((t) => (
                            <span
                                key={t}
                                className="font-mono text-[11px] text-text-muted bg-surface2/60 border border-white/[0.06] px-2 py-0.5 rounded-md"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
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
                <div className="absolute left-[5px] top-[6px] bottom-[6px] w-0.5 bg-white/[0.06]" />

                {/* Accent fill line */}
                <motion.div
                    className="absolute left-[5px] top-[6px] w-0.5 bg-accent origin-top shadow-[0_0_10px_rgba(226,160,78,0.3)]"
                    style={{ height: lineHeight }}
                />

                <div className="flex flex-col gap-[30px]">
                    {entries.map((entry, i) => (
                        <TimelineEntry key={i} entry={entry} index={i} />
                    ))}
                </div>
            </div>

            <Credentials />
        </section>
    );
}
