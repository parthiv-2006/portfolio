import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Rocket, Code2 } from 'lucide-react';
import SectionHeading from './SectionHeading';

const entries = [
    {
        icon: Code2,
        title: 'GenLedge',
        subtitle: 'Software Developer',
        date: 'Mar 2026 – Apr 2026',
        description:
            'Built a Stripe MCP server (TypeScript, 12 tools) enabling AI accounting agents to query live payment data via the Model Context Protocol. Engineered a webhook pipeline with HMAC-SHA256 verification routing 12 event types to specialized AI employee roles for real-time general ledger entry generation.',
        type: 'experience',
    },
    {
        icon: Rocket,
        title: 'Outamation',
        subtitle: 'AI and Automation Extern',
        date: 'Summer 2025',
        description:
            'Engineering NLP and Computer Vision pipelines to automate high-volume document classification. Optimizing Retrieval-Augmented Generation (RAG) systems with LlamaIndex and custom vector embeddings.',
        type: 'experience',
    },
    {
        icon: GraduationCap,
        title: 'University of Toronto, St. George',
        subtitle: 'Computer Science Specialist Co-op',
        date: '2024 – 2028',
        description:
            "Pursuing a Bachelor of Computer Science. Dean's List Scholar. Coursework includes Data Structures & Analysis, Software Design, Systems Programming, and Computer Organization.",
        type: 'education',
    },
    {
        icon: Briefcase,
        title: 'Chester-Hill Solutions',
        subtitle: 'Software QA Tester',
        date: 'June 2024 – Nov 2024',
        description:
            'Developed automated scripts for critical user flows to decrease regression testing time. Accelerated bug resolution through detailed API response analysis and root cause documentation.',
        type: 'experience',
    },
    {
        icon: Award,
        title: 'Ontario Liberal Party',
        subtitle: 'Frontend Developer',
        date: 'May 2023 – Sept 2023',
        description:
            'Built React components and optimized Redux state management. Refactored legacy CSS into modular Sass and enforced WCAG 2.1 compliance, improving page performance and accessibility scores.',
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

            {/* Card */}
            <div className="border border-white/[0.06] rounded-2xl bg-surface p-5 transition-all duration-300 hover:border-white/[0.12] hover:translate-x-1">
                <p className="font-mono text-xs text-accent mb-2">{entry.date}</p>
                <h3 className="text-[17px] font-semibold text-text mb-1">{entry.title}</h3>
                <p className="text-[13.5px] text-accent mb-2">{entry.subtitle}</p>
                <p className="text-sm text-text-muted leading-relaxed">{entry.description}</p>
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
                subtitle="Key milestones in my development as a software engineer."
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
        </section>
    );
}
