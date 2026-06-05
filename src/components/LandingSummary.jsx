import { motion } from 'framer-motion';
import { Download, Mail, Github, Linkedin } from 'lucide-react';
import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiNextdotjs,
    SiFastapi,
    SiGit,
} from 'react-icons/si';
import GitHubGraph from './GitHubGraph';

const TOP_SKILLS = [
    { name: 'Python', icon: SiPython },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'React', icon: SiReact },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'FastAPI', icon: SiFastapi },
    { name: 'Git/GitHub', icon: SiGit },
];

const CONTACT_LINKS = [
    {
        label: 'Email',
        href: 'mailto:parthiv.paul@mail.utoronto.ca',
        icon: Mail,
        external: false,
    },
    {
        label: 'GitHub',
        href: 'https://github.com/parthiv-2006',
        icon: Github,
        external: true,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/parthiv-paul',
        icon: Linkedin,
        external: true,
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingSummary({ onEnter }) {
    return (
        <div className="min-h-screen bg-bg text-text flex items-start justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
            {/* Ambient warm glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 55% at 50% 28%, rgba(226,160,78,0.07) 0%, transparent 65%)',
                }}
            />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 w-full max-w-2xl mx-auto"
            >
                {/* ── Name + Role ── */}
                <motion.div variants={fadeUp} className="mb-8 text-center">
                    <h1
                        className="font-display text-text leading-[0.9] tracking-tight mb-4"
                        style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontStyle: 'italic' }}
                    >
                        Parthiv Paul<span className="text-accent">.</span>
                    </h1>
                    <div className="w-16 h-px bg-accent mx-auto mb-4" />
                    <p className="font-mono text-accent text-sm tracking-wide">
                        cs @ uoft · full-stack &amp; ai engineer
                    </p>
                    <p className="text-text-muted text-sm mt-2 leading-relaxed">
                        Always Learning. Always Building. Sometimes it works out.
                    </p>
                </motion.div>

                {/* ── About blurb ── */}
                <motion.div
                    variants={fadeUp}
                    className="mb-6 p-5 rounded-xl border border-white/[0.06] bg-surface/60"
                >
                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-3">
                        About
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed">
                        I'm a{' '}
                        <span className="text-accent font-medium">
                            CS Specialist at the University of Toronto
                        </span>
                        , building everything from AI agents to full-stack web products. Looking for{' '}
                        <span className="text-accent font-medium">Fall 2026</span> and{' '}
                        <span className="text-accent font-medium">Winter 2027</span> software
                        engineering internships — if you're building something worth working on, I'm
                        open to a conversation.
                    </p>
                </motion.div>

                {/* ── Core Skills ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-3">
                        Core Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {TOP_SKILLS.map(({ name, icon: Icon }) => (
                            <div
                                key={name}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/20 bg-surface text-sm"
                            >
                                <Icon size={14} className="text-accent shrink-0" />
                                <span className="text-text font-medium">{name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── GitHub Activity ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <GitHubGraph />
                </motion.div>

                {/* ── Contact + Resume ── */}
                <motion.div
                    variants={fadeUp}
                    className="mb-8 flex flex-wrap items-center gap-2.5 justify-center"
                >
                    {CONTACT_LINKS.map(({ label, href, icon: Icon, external }) => (
                        <a
                            key={label}
                            href={href}
                            {...(external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-white/[0.06] text-text-muted text-sm hover:text-accent hover:border-accent/30 transition-all duration-200"
                        >
                            <Icon size={14} />
                            {label}
                        </a>
                    ))}

                    <a
                        href="newresume.pdf"
                        download="Parthiv_Paul_Resume.pdf"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/25 bg-accent/[0.07] text-accent text-sm hover:bg-accent/15 hover:border-accent/40 transition-all duration-300"
                    >
                        <Download size={14} />
                        Resume
                    </a>
                </motion.div>

                {/* ── CTA ── */}
                <motion.div variants={fadeUp} className="flex justify-center">
                    <button
                        onClick={onEnter}
                        className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-base font-medium bg-accent text-bg hover:bg-accent/90 transition-all duration-300 shadow-[0_0_30px_rgba(226,160,78,0.25)] hover:shadow-[0_0_40px_rgba(226,160,78,0.35)]"
                    >
                        View Full Portfolio
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </button>
                </motion.div>

                <motion.p
                    variants={fadeUp}
                    className="text-center text-text-dim text-xs font-mono mt-6"
                >
                    © {new Date().getFullYear()} Parthiv Paul
                </motion.p>
            </motion.div>
        </div>
    );
}
