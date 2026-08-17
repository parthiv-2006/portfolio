import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Briefcase, ArrowDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const bylineFacts = [
    { icon: MapPin, label: 'Toronto, Canada' },
    { icon: GraduationCap, label: 'CS Specialist @ University of Toronto' },
    { icon: Briefcase, label: 'Software Engineer @ Velox Systems' },
];

/* Parent/child pair so the paragraphs land one after another instead of as
   a single block. */
const storyGroup = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const storyLine = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function About() {
    const reducedMotion = usePrefersReducedMotion();

    const scrollToLab = (e) => {
        e.preventDefault();
        document.getElementById('lab')?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    };

    return (
        <section id="about" className="w-full">
            <div className="w-full">
                <SectionHeading label="About" title="Who I Am" />

                {/* Byline: quick facts as a pill row, no boxed frame */}
                <motion.ul
                    role="list"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-8 border-b border-border"
                >
                    {bylineFacts.map(({ icon: Icon, label }) => (
                        <li
                            key={label}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-[13px] sm:text-sm text-text-muted"
                        >
                            <Icon size={14} className="text-accent shrink-0" aria-hidden="true" />
                            <span>{label}</span>
                        </li>
                    ))}
                </motion.ul>

                {/* Story + facts */}
                <div className="relative max-w-[720px]">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute -top-4 left-0 sm:-top-10 sm:-left-6 font-display text-accent/[0.09] leading-none"
                        style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
                    >
                        &ldquo;
                    </span>

                    <motion.div
                        variants={storyGroup}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        className="relative mb-10"
                    >
                        <motion.p
                            variants={storyLine}
                            className="font-display italic text-text leading-snug mb-6"
                            style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)' }}
                        >
                            I'm a <span className="text-accent">CS Specialist at the University of Toronto</span>. I care more about the problem than the tools, so I end up working on whatever it calls for.
                        </motion.p>
                        <motion.p variants={storyLine} className="text-text-muted text-base leading-relaxed mb-5">
                            Right now I'm a <span className="text-accent font-medium">software engineer at Velox Systems</span>, rebuilding a contractor's production workspace on FastAPI and Postgres. Before that I shipped a Stripe subscription system at Applied Optimal, a Stripe MCP server at GenLedge, and RAG pipelines at Outamation.
                        </motion.p>
                        <motion.p variants={storyLine} className="text-text-muted text-base leading-relaxed mb-5">
                            Looking for software engineering internships for{' '}
                            <span className="text-accent font-medium">Fall 2026</span> and{' '}
                            <span className="text-accent font-medium">Winter 2027</span>.
                            If you're building something worth working on, I'm open to a conversation.
                        </motion.p>
                        <motion.p variants={storyLine} className="text-text-muted text-base leading-relaxed">
                            Outside of code, I travel whenever I can, I'm really into fitness and hiking, play guitar, and read more than I probably should.
                        </motion.p>
                    </motion.div>

                    <a
                        href="#lab"
                        onClick={scrollToLab}
                        className="group relative inline-flex items-center gap-2 px-4 py-3 border border-border rounded-xl bg-surface font-mono text-xs text-text-muted transition-all duration-300 hover:border-accent/40 hover:bg-surface2 hover:text-text active:scale-[0.98]"
                    >
                        <span className="text-accent" aria-hidden="true">✦</span>
                        <span>
                            fun facts live in the terminal · run <span className="text-accent">facts</span>
                        </span>
                        <ArrowDown
                            size={14}
                            className="text-accent shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
