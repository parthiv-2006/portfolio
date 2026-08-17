import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';
import useIsTouch from '../hooks/useIsTouch';
import { Download, Mail, Github, Linkedin, Brain, Check, Send, AlertCircle } from 'lucide-react';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';
import {
    SiPython,
    SiTypescript,
    SiReact,
    SiNodedotjs,
    SiNextdotjs,
    SiFastapi,
    SiGit,
    SiPostgresql,
    SiTailwindcss,
    SiDocker,
    SiAnthropic,
} from 'react-icons/si';
import GitHubGraph from './GitHubGraph';
import GitHubStreak from './GitHubStreak';

const TOP_SKILLS = [
    { name: 'TypeScript',   icon: SiTypescript },
    { name: 'Python',       icon: SiPython },
    { name: 'React',        icon: SiReact },
    { name: 'Next.js',      icon: SiNextdotjs },
    { name: 'FastAPI',      icon: SiFastapi },
    { name: 'Node.js',      icon: SiNodedotjs },
    { name: 'PostgreSQL',   icon: SiPostgresql },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'Claude Code',  icon: SiAnthropic },
    { name: 'MCP',          icon: Brain },
    { name: 'Docker',       icon: SiDocker },
    { name: 'Git/GitHub',   icon: SiGit },
];

const EMAIL = 'parthiv.paul@mail.utoronto.ca';

/**
 * navigator.clipboard is undefined on insecure origins and its promise can
 * reject when the permission is denied, so fall back to the legacy
 * execCommand path before giving up. Resolves to true when the copy landed.
 */
async function copyText(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // fall through to the legacy path
    }
    try {
        const scratch = document.createElement('textarea');
        scratch.value = text;
        scratch.setAttribute('readonly', '');
        scratch.style.position = 'fixed';
        scratch.style.top = '0';
        scratch.style.opacity = '0';
        document.body.appendChild(scratch);
        scratch.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(scratch);
        return ok;
    } catch {
        return false;
    }
}

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
    // 'idle' | 'copied' | 'failed'
    const [copyState, setCopyState] = useState('idle');
    const [copyAnnouncement, setCopyAnnouncement] = useState('');
    const magnetic = useMagnetic(0.38);
    const isTouch = useIsTouch();
    const [contactOpen, setContactOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [contactStatus, setContactStatus] = useState('idle');

    const handleEmailClick = async (e) => {
        e.preventDefault();
        const ok = await copyText(EMAIL);
        setCopyState(ok ? 'copied' : 'failed');
        setCopyAnnouncement(
            ok
                ? `Email address copied to clipboard: ${EMAIL}`
                : `Could not copy automatically. Email address is ${EMAIL}`
        );
        setTimeout(() => {
            setCopyState('idle');
            setCopyAnnouncement('');
        }, 4000);
    };

    const handleContactOpen = () => {
        setContactStatus('idle');
        setContactForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setContactOpen(true);
    };

    // The magnetic drift needs a real cursor. On coarse pointers it either does
    // nothing or fires off synthesized mouse events, so drop it entirely there.
    const magneticProps = isTouch
        ? {}
        : {
              ref: magnetic.ref,
              style: magnetic.motionStyle,
              onMouseMove: magnetic.onMouseMove,
              onMouseLeave: magnetic.onMouseLeave,
          };

    return (
        <div className="min-h-screen bg-bg text-text flex items-start justify-center py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
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
                    {/* Primary action — the one control everything else defers to. */}
                    <div className="relative inline-flex mt-9 w-full max-w-[320px] sm:w-auto sm:max-w-none">
                        <span
                            className="absolute inset-0 rounded-full border border-accent/50 animate-[ring-pulse_2.6s_ease-out_infinite] pointer-events-none"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute inset-0 rounded-full border border-accent/50 animate-[ring-pulse_2.6s_ease-out_infinite_1.3s] pointer-events-none"
                            aria-hidden="true"
                        />
                        <motion.button
                            {...magneticProps}
                            type="button"
                            onClick={onEnter}
                            className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 sm:px-[42px] py-[18px] rounded-full text-[17px] font-semibold tracking-[-0.01em] bg-accent text-bg transition-[box-shadow] duration-300 shadow-[0_0_40px_rgba(226,160,78,0.22)] hover:shadow-[0_0_56px_rgba(226,160,78,0.55)] overflow-hidden"
                        >
                            <span
                                className="absolute top-0 bottom-0 left-0 w-[45%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[sheen_3.4s_ease-in-out_infinite] pointer-events-none"
                                aria-hidden="true"
                            />
                            <span className="relative z-10">View Full Portfolio</span>
                            <span
                                className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1 animate-[arrow-nudge_1.5s_ease-in-out_infinite]"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </motion.button>
                    </div>
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
                        </span>{' '}
                        and a{' '}
                        <span className="text-accent font-medium">
                            software engineer at Velox Systems
                        </span>
                        , building everything from AI agents to full-stack web products. Looking for{' '}
                        <span className="text-accent font-medium">Fall 2026</span> and{' '}
                        <span className="text-accent font-medium">Winter 2027</span> software
                        engineering internships. If you're building something worth working on, let's
                        talk.
                    </p>
                </motion.div>

                {/* ── Core Skills — 2-col grid ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.18em] mb-3">
                        Core stack
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {TOP_SKILLS.map(({ name, icon: Icon }) => (
                            <div
                                key={name}
                                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-[9px] rounded-[11px] border border-white/[0.06] bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35"
                            >
                                <Icon size={16} className="text-accent shrink-0" />
                                <span className="text-text font-medium text-[13px] truncate">{name}</span>
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
                <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center gap-2.5">
                    {/* Secondary actions — outlined, so nothing else reads as filled but the CTA. */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleContactOpen}
                            aria-haspopup="dialog"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/30 text-accent text-sm hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 min-h-[44px]"
                        >
                            <Send size={14} aria-hidden="true" />
                            Get in Touch
                        </button>

                        <a
                            href="parthiv_paul_swe.pdf"
                            download="parthiv_paul_swe.pdf"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/30 text-accent text-sm hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 min-h-[44px]"
                        >
                            <Download size={14} aria-hidden="true" />
                            Resume
                        </a>
                    </div>

                    {/* Tertiary actions — quietest tier. */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handleEmailClick}
                            aria-label={`Copy email address ${EMAIL}`}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface/60 border text-[13px] transition-all duration-200 min-h-[44px] ${
                                copyState === 'copied'
                                    ? 'border-accent/40 text-accent'
                                    : copyState === 'failed'
                                      ? 'border-white/[0.12] text-text'
                                      : 'border-white/[0.06] text-text-muted hover:text-accent hover:border-accent/30'
                            }`}
                        >
                            {copyState === 'copied' ? (
                                <Check size={14} aria-hidden="true" />
                            ) : copyState === 'failed' ? (
                                <AlertCircle size={14} aria-hidden="true" />
                            ) : (
                                <Mail size={14} aria-hidden="true" />
                            )}
                            {copyState === 'copied'
                                ? 'Copied!'
                                : copyState === 'failed'
                                  ? 'Copy failed'
                                  : 'Email'}
                        </button>

                        <a
                            href="https://github.com/parthiv-2006"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface/60 border border-white/[0.06] text-text-muted text-[13px] hover:text-accent hover:border-accent/30 transition-all duration-200 min-h-[44px]"
                        >
                            <Github size={14} aria-hidden="true" />
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/parthiv-paul"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface/60 border border-white/[0.06] text-text-muted text-[13px] hover:text-accent hover:border-accent/30 transition-all duration-200 min-h-[44px]"
                        >
                            <Linkedin size={14} aria-hidden="true" />
                            LinkedIn
                        </a>
                    </div>

                    {/* Clipboard result is announced here, not just shown on the button. */}
                    <p aria-live="polite" className="sr-only">
                        {copyAnnouncement}
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
