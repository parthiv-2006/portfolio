import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Github, Linkedin, Brain, Check, Send } from 'lucide-react';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';
import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiNextdotjs,
    SiFastapi,
    SiGit,
    SiMongodb,
    SiTailwindcss,
    SiDocker,
    SiOpenai,
} from 'react-icons/si';
import GitHubGraph from './GitHubGraph';
import GitHubStreak from './GitHubStreak';

const TOP_SKILLS = [
    { name: 'Python',       icon: SiPython },
    { name: 'JavaScript',   icon: SiJavascript },
    { name: 'TypeScript',   icon: SiTypescript },
    { name: 'React',        icon: SiReact },
    { name: 'Node.js',      icon: SiNodedotjs },
    { name: 'Next.js',      icon: SiNextdotjs },
    { name: 'FastAPI',      icon: SiFastapi },
    { name: 'MongoDB',      icon: SiMongodb },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'Claude Code',  icon: Brain },
    { name: 'Docker',       icon: SiDocker },
    { name: 'Git/GitHub',   icon: SiGit },
];

const EMAIL = 'parthiv.paul@mail.utoronto.ca';

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
    const [emailCopied, setEmailCopied] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [contactStatus, setContactStatus] = useState('idle');

    const handleEmailClick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(EMAIL);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    const handleContactOpen = () => {
        setContactStatus('idle');
        setContactForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setContactOpen(true);
    };

    return (
        <div className="min-h-screen bg-bg text-text flex items-start justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
            {/* Ambient warm glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 72% 56% at 50% 26%, rgba(226,160,78,0.10) 0%, transparent 64%)',
                }}
            />
            {/* Grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 75%)',
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000, transparent 75%)',
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
                        Always learning. Always building. Sometimes it works out.
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
                        engineering internships. If you're building something worth working on, let's
                        talk.
                    </p>
                </motion.div>

                {/* ── Core Skills — 6 × 2 grid ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em] mb-3">
                        Core Stack
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {TOP_SKILLS.map(({ name, icon: Icon }) => (
                            <div
                                key={name}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/20 bg-surface text-sm"
                            >
                                <Icon size={14} className="text-accent shrink-0" />
                                <span className="text-text font-medium text-xs truncate">{name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── GitHub Activity ── */}
                <motion.div variants={fadeUp} className="mb-4">
                    <GitHubGraph />
                </motion.div>

                {/* ── Streak pill ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <GitHubStreak compact />
                </motion.div>

                {/* ── Contact + Resume ── */}
                <motion.div
                    variants={fadeUp}
                    className="mb-8 flex flex-wrap items-center gap-2.5 justify-center"
                >
                    {/* Send message — opens ContactModal */}
                    <button
                        onClick={handleContactOpen}
                        aria-haspopup="dialog"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/25 bg-accent/[0.07] text-accent text-sm hover:bg-accent/15 hover:border-accent/40 transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <Send size={14} />
                        Get in Touch
                    </button>

                    {/* Email — copies to clipboard */}
                    <button
                        onClick={handleEmailClick}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border text-sm transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                            emailCopied
                                ? 'border-accent/40 text-accent'
                                : 'border-white/[0.06] text-text-muted hover:text-accent hover:border-accent/30'
                        }`}
                    >
                        {emailCopied ? <Check size={14} /> : <Mail size={14} />}
                        {emailCopied ? 'Copied!' : 'Email'}
                    </button>

                    <a
                        href="https://github.com/parthiv-2006"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-white/[0.06] text-text-muted text-sm hover:text-accent hover:border-accent/30 transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <Github size={14} />
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/parthiv-paul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-white/[0.06] text-text-muted text-sm hover:text-accent hover:border-accent/30 transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <Linkedin size={14} />
                        LinkedIn
                    </a>

                    <a
                        href="parthiv_paul_swe.pdf"
                        download="parthiv_paul_swe.pdf"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/25 bg-accent/[0.07] text-accent text-sm hover:bg-accent/15 hover:border-accent/40 transition-all duration-300 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    >
                        <Download size={14} />
                        Resume
                    </a>
                </motion.div>

                {/* ── CTA ── */}
                <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-dim">
                        Step inside the full experience
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                        {[
                            { prefix: '06', label: 'shipped projects' },
                            { prefix: '$_', label: 'interactive terminal' },
                            { prefix: '↗', label: 'full journey & lab' },
                        ].map(({ prefix, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.06] bg-surface font-mono text-xs text-text-muted"
                            >
                                <span className="text-accent">{prefix}</span> {label}
                            </span>
                        ))}
                    </div>
                    <div className="relative inline-flex">
                        <span className="absolute inset-0 rounded-full border border-accent/50 animate-[ring-pulse_2.6s_ease-out_infinite] pointer-events-none" />
                        <span className="absolute inset-0 rounded-full border border-accent/50 animate-[ring-pulse_2.6s_ease-out_infinite_1.3s] pointer-events-none" />
                        <button
                            onClick={onEnter}
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-base font-medium bg-accent text-bg hover:bg-accent/90 transition-all duration-300 shadow-[0_0_30px_rgba(226,160,78,0.25)] hover:shadow-[0_0_50px_rgba(226,160,78,0.45)] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                        >
                            <span className="absolute top-0 bottom-0 left-0 w-[45%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[sheen_3.4s_ease-in-out_infinite] pointer-events-none" />
                            <span className="relative z-10">View Full Portfolio</span>
                            <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1 animate-[arrow-nudge_1.5s_ease-in-out_infinite]">→</span>
                        </button>
                    </div>
                    <p className="font-mono text-[10px] text-text-dim tracking-[0.05em]">
                        no scroll-jacking · just craft
                    </p>
                </motion.div>

                <motion.p
                    variants={fadeUp}
                    className="text-center text-text-dim text-xs font-mono mt-6"
                >
                    © {new Date().getFullYear()} Parthiv Paul
                </motion.p>
            </motion.div>

            <ContactModal
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                form={contactForm}
                setForm={setContactForm}
                status={contactStatus}
                setStatus={setContactStatus}
            />
        </div>
    );
}
