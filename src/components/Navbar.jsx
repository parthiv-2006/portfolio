import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import ContactModal, { DEFAULT_MESSAGE } from './ContactModal';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const navLinks = [
    { label: 'about',    href: '#about',    id: 'about' },
    { label: 'activity', href: '#activity', id: 'activity' },
    { label: 'work',     href: '#work',     id: 'work' },
    { label: 'journey',  href: '#journey',  id: 'journey' },
    { label: 'terminal', href: '#lab',      id: 'lab' },
    { label: 'contact',  href: '#contact',  id: 'contact' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

const MOBILE_MENU_ID = 'mobile-nav-menu';

function useTextScramble(text, enabled) {
    const [display, setDisplay] = useState(text);
    const intervalRef = useRef(null);
    const frameRef = useRef(0);

    const scramble = useCallback(() => {
        if (!enabled) return;
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
    }, [text, enabled]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        setDisplay(text);
    }, [text]);

    useEffect(() => () => clearInterval(intervalRef.current), []);
    // With reduced motion the interval never runs, so fall back to the plain label.
    return { display: enabled ? display : text, scramble, reset };
}

function ScrambleLink({ label, href, isActive, onClick }) {
    const reducedMotion = usePrefersReducedMotion();
    const { display, scramble, reset } = useTextScramble(label, !reducedMotion);
    return (
        <a
            href={href}
            onClick={onClick}
            onMouseEnter={scramble}
            onMouseLeave={reset}
            aria-current={isActive ? 'page' : undefined}
            className={`relative font-mono text-[12px] tracking-[0.04em] px-2.5 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? 'text-text' : 'text-text-muted hover:text-text'
            }`}
        >
            {display}
            {isActive && (
                <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2.5 right-2.5 h-px bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}
        </a>
    );
}

export default function Navbar({ activeSection, theme, toggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [form, setForm] = useState({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
    const [status, setStatus] = useState('idle');
    const reducedMotion = usePrefersReducedMotion();
    const toggleRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        let frame = null;
        const read = () => {
            frame = null;
            setScrolled(window.scrollY > 40);
        };
        // Coalesce bursts of scroll events into one state write per frame.
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(read);
        };
        read();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    // While the mobile menu is open: freeze the page behind it, close on Escape,
    // and keep focus inside the overlay instead of on the hidden page.
    useEffect(() => {
        if (!mobileOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);

        menuRef.current?.querySelector('a, button')?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            toggleRef.current?.focus();
        };
    }, [mobileOpen]);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
        setMobileOpen(false);
    };

    const handleContactOpen = () => {
        setStatus('idle');
        setForm({ email: '', message: DEFAULT_MESSAGE, _hp: '' });
        setContactOpen(true);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-[padding] duration-300"
                style={{
                    paddingTop: scrolled
                        ? 'max(0.5rem, env(safe-area-inset-top))'
                        : 'max(1rem, env(safe-area-inset-top))',
                }}
            >
                <div
                    className={`flex items-center justify-between gap-4 w-full max-w-[1120px] px-4 sm:px-5 rounded-full border bg-nav-bg backdrop-blur-xl transition-[padding,border-color,box-shadow] duration-300 ${
                        scrolled
                            ? 'py-1.5 border-border-hover shadow-xl shadow-black/40'
                            : 'py-2.5 border-border shadow-lg shadow-black/20'
                    }`}
                >
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => handleNavClick(e, '#hero')}
                        className="font-display text-text hover:text-accent transition-colors duration-300 text-xl shrink-0"
                        style={{ fontStyle: 'italic' }}
                    >
                        Parthiv<span className="text-accent">.</span>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1 font-mono text-sm flex-wrap justify-end">
                        {navLinks.map((link) => (
                            <ScrambleLink
                                key={link.id}
                                label={link.label}
                                href={link.href}
                                isActive={activeSection === link.id}
                                onClick={(e) => handleNavClick(e, link.href)}
                            />
                        ))}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-accent bg-transparent cursor-pointer transition-[border-color,transform] duration-300 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>
                        <button
                            onClick={handleContactOpen}
                            className="ml-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-full bg-accent text-bg font-sans font-semibold text-[13px] border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_var(--color-accent-dim)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                            Get in touch
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        ref={toggleRef}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg"
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                        aria-controls={MOBILE_MENU_ID}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id={MOBILE_MENU_ID}
                        ref={menuRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl overflow-y-auto overscroll-contain"
                    >
                        {/* min-h-full keeps the items centred when they fit and lets the
                            overlay scroll instead of clipping them when they do not. */}
                        <div className="min-h-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 py-20 sm:py-24">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.id}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    aria-current={activeSection === link.id ? 'page' : undefined}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className={`shrink-0 font-mono text-lg tracking-[0.15em] transition-colors ${
                                        activeSection === link.id ? 'text-accent' : 'text-text-dim hover:text-text'
                                    }`}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <motion.button
                                onClick={() => { handleContactOpen(); setMobileOpen(false); }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: navLinks.length * 0.06, duration: 0.4 }}
                                className="shrink-0 inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-accent text-bg font-semibold text-sm"
                            >
                                Get in touch
                            </motion.button>
                            <motion.button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: (navLinks.length + 1) * 0.06, duration: 0.4 }}
                                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-border text-accent bg-transparent"
                            >
                                {theme === 'night' ? <Sun size={15} /> : <Moon size={15} />}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContactModal
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                form={form}
                setForm={setForm}
                status={status}
                setStatus={setStatus}
            />
        </>
    );
}
