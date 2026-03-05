import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '#hero', id: 'hero' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#timeline', id: 'timeline' },
    { label: 'Contact', href: '#contact', id: 'contact' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

/* ── Scramble text hook ── */
function useTextScramble(text) {
    const [display, setDisplay] = useState(text);
    const intervalRef = useRef(null);
    const frameRef = useRef(0);

    const scramble = useCallback(() => {
        frameRef.current = 0;
        const totalFrames = text.length + 8;

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            frameRef.current++;
            const progress = frameRef.current / totalFrames;

            const result = text
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    const charProgress = i / text.length;
                    if (progress > charProgress + 0.3) return char;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            setDisplay(result);

            if (frameRef.current >= totalFrames) {
                clearInterval(intervalRef.current);
                setDisplay(text);
            }
        }, 30);
    }, [text]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        setDisplay(text);
    }, [text]);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return { display, scramble, reset };
}

/* ── Scramble Link ── */
function ScrambleLink({ label, href, isActive, onClick }) {
    const { display, scramble, reset } = useTextScramble(label);

    return (
        <a
            href={href}
            onClick={onClick}
            onMouseEnter={scramble}
            onMouseLeave={reset}
            className={`relative font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 inline-block min-w-[60px] ${isActive ? 'text-accent' : 'text-text-dim hover:text-text'
                }`}
        >
            <span className="inline-block" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {display}
            </span>
            {isActive && (
                <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </a>
    );
}

/* ── Navbar ── */
export default function Navbar({ activeSection }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const container = document.querySelector('.snap-container');
        const target = container || window;
        const onScroll = () => {
            const scrollTop = container ? container.scrollTop : window.scrollY;
            setScrolled(scrollTop > 80);
        };
        target.addEventListener('scroll', onScroll);
        return () => target.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileOpen(false);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
                        ? 'top-4 left-1/2 -translate-x-1/2 w-auto'
                        : 'top-0 left-0 right-0 w-full'
                    }`}
            >
                <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
                            ? 'bg-surface/80 backdrop-blur-xl border border-white/[0.08] rounded-full shadow-lg shadow-black/20 px-6 py-2.5'
                            : 'bg-transparent px-6 py-4'
                        }`}
                >
                    <div className={`flex items-center justify-between ${scrolled ? '' : 'max-w-7xl mx-auto'
                        }`}>
                        {/* Logo — fades out when pill mode */}
                        <motion.a
                            href="#hero"
                            onClick={(e) => handleNavClick(e, '#hero')}
                            className={`font-display text-text hover:text-accent transition-all duration-300 ${scrolled
                                    ? 'text-sm w-0 opacity-0 overflow-hidden pointer-events-none'
                                    : 'text-lg opacity-100'
                                }`}
                            style={{ fontStyle: 'italic' }}
                        >
                            Parthiv Paul
                        </motion.a>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <ScrambleLink
                                    key={link.id}
                                    label={link.label}
                                    href={link.href}
                                    isActive={activeSection === link.id}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                />
                            ))}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-text-muted hover:text-accent transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu — full screen overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.id}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className={`font-mono text-lg tracking-[0.15em] uppercase transition-colors ${activeSection === link.id
                                        ? 'text-accent'
                                        : 'text-text-dim hover:text-text'
                                    }`}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
